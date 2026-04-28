// Daily reminder scheduler — fires at 14:00 and 21:00 local time.
// Strategy:
//   1. Register the service worker so notifications can fire even when the tab is in the background.
//   2. Compute the next scheduled time in ms-from-now for each slot.
//   3. setTimeout to that moment; on fire, show notification via the SW registration and reschedule.
//   4. On tab focus / visibility change, reconcile schedule (covers laptop sleep / phone wake).
//
// Caveats (be honest with the student):
//   • iOS Safari only fires local notifications when the PWA is added to home screen AND the device
//     hasn't fully suspended the page. Bulletproof reminders need a server cron + Web Push.
//   • Android / desktop Chrome fire reliably while the SW is alive (which it generally is for a few
//     minutes after the tab closes). Adding the PWA to home screen extends this dramatically.

import { getState, setState } from './storage.js';

const SLOTS = [
  { hour: 14, minute: 0, kind: 'afternoon' },
  { hour: 21, minute: 0, kind: 'evening' }
];

const MESSAGES = {
  afternoon: [
    { title: 'JEEPrep — afternoon check-in', body: 'Lunch done? One topic at a time. Open Syllabus and pick the one you\'ve been avoiding.' },
    { title: 'JEEPrep — afternoon check-in', body: 'School wrapped up. Twenty minutes of revision before you scroll. Future you will thank you.' },
    { title: 'JEEPrep — afternoon check-in', body: 'Open today\'s plan. Even if you do half of it, half is honest progress.' }
  ],
  evening: [
    { title: 'JEEPrep — wind down', body: 'Log today\'s minutes. Glance at tomorrow. Sleep by 11 — your brain consolidates today during sleep.' },
    { title: 'JEEPrep — wind down', body: 'One last 10-minute formula flash, then close the books. Don\'t pull an all-nighter for ground you can cover Saturday.' },
    { title: 'JEEPrep — wind down', body: 'How was today? Open Notes — one line about what clicked, one line about what didn\'t. That\'s the audit.' }
  ]
};

let timers = []; // active setTimeout handles
let registered = false;

function pickMessage(kind){
  const arr = MESSAGES[kind] || MESSAGES.afternoon;
  return arr[Math.floor(Math.random() * arr.length)];
}

function nextOccurrence(hour, minute){
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

async function fireSlot(kind){
  const m = pickMessage(kind);
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg && Notification.permission === 'granted'){
      reg.showNotification(m.title, {
        body: m.body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `jeeprep-${kind}`,
        renotify: true,
        requireInteraction: false,
        data: { url: '/#dashboard', kind, ts: Date.now() }
      });
    } else if (Notification.permission === 'granted'){
      // Fallback: plain Notification (no SW)
      new Notification(m.title, { body: m.body, icon: '/icon-192.png', tag: `jeeprep-${kind}` });
    }
  } catch (e){
    console.warn('[notifications] fire failed:', e);
  }
}

function clearAll(){
  for (const t of timers) clearTimeout(t);
  timers = [];
}

export function scheduleAll(){
  clearAll();
  if (typeof window === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  const enabled = getState().notifications?.enabled;
  if (!enabled) return;

  for (const slot of SLOTS){
    const ms = nextOccurrence(slot.hour, slot.minute);
    const handle = setTimeout(() => {
      fireSlot(slot.kind);
      // Reschedule for tomorrow's same slot
      scheduleAll();
    }, ms);
    timers.push(handle);
  }
}

export async function registerServiceWorker(){
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
  if (registered) return navigator.serviceWorker.ready;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    registered = true;
    return reg;
  } catch (e){
    console.warn('[sw] registration failed:', e);
    return null;
  }
}

export async function requestPermissionAndEnable(){
  if (typeof Notification === 'undefined'){
    return { ok: false, reason: 'Your browser does not support notifications.' };
  }
  if (Notification.permission === 'denied'){
    return { ok: false, reason: 'Notifications are blocked in browser settings. Re-enable them there, then try again.' };
  }
  let perm = Notification.permission;
  if (perm !== 'granted'){
    perm = await Notification.requestPermission();
  }
  if (perm !== 'granted'){
    setState({ notifications: { askedAt: new Date().toISOString() } });
    return { ok: false, reason: 'Permission not granted.' };
  }
  await registerServiceWorker();
  setState({ notifications: { enabled: true, askedAt: new Date().toISOString() } });
  scheduleAll();
  return { ok: true };
}

export function disable(){
  setState({ notifications: { enabled: false } });
  clearAll();
}

export async function fireTest(){
  if (Notification.permission !== 'granted'){
    const r = await requestPermissionAndEnable();
    if (!r.ok) return r;
  }
  await fireSlot('afternoon');
  return { ok: true };
}

/** Called once at app boot from App.jsx. */
export function initNotifications(){
  if (typeof window === 'undefined') return;
  // Register SW (always, even if user hasn't enabled notifications — needed for PWA install)
  registerServiceWorker();

  // If user has enabled & permission still granted, schedule
  if (Notification?.permission === 'granted' && getState().notifications?.enabled){
    scheduleAll();
  }

  // Reconcile on tab focus (covers laptop wake)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && getState().notifications?.enabled && Notification?.permission === 'granted'){
      scheduleAll();
    }
  });
}

export function notificationStatus(){
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
}
