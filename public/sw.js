// JEEPrep Service Worker — caching + push notifications
// Place at: public/sw.js
// Register from: src/main.jsx  (see bottom of this file)

const CACHE_NAME   = 'jeeprep-v1';
const STATIC_CACHE = 'jeeprep-static-v1';

// Assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// ── INSTALL — pre-cache shell ────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE — clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — network-first with cache fallback ────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  // API calls — network only, no caching
  if (request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Everything else: network-first, fall back to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => {
        if (cached) return cached;
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') return caches.match('/index.html');
      }))
  );
});

// ── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────
// Two daily reminders — morning (7 AM) and evening (7 PM)
// The server sends a push payload like:
//   { title, body, url, badge, icon, tag }
// If you don't have a push server, use scheduled notifications instead (see bottom).

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data?.json() || {}; } catch {}

  const title   = data.title || 'JEEPrep — Time to study!';
  const options = {
    body:    data.body  || 'Your next session is waiting. Consistency beats intensity.',
    icon:    data.icon  || '/icons/icon-192.png',
    badge:   data.badge || '/icons/icon-96.png',
    tag:     data.tag   || 'jeeprep-reminder',
    data:    { url: data.url || '/' },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open',   title: '📖 Open JEEPrep' },
      { action: 'dismiss',title: '🔕 Dismiss' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ── NOTIFICATION CLICK ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus existing window if open
      const match = list.find(c => c.url.startsWith(self.location.origin) && 'focus' in c);
      if (match) { match.focus(); return; }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── BACKGROUND SYNC (optional) ───────────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Future: sync study logs to a backend if network was offline
  // For now this is a no-op placeholder
}

// ── MESSAGE CHANNEL — trigger local notifications from app ───────────────────
// The app can send { type: 'SCHEDULE_NOTIFICATIONS' } to this SW.
// We store them and fire at the right time using setInterval approximation.
// (True background scheduling needs a push server; this works while the browser is open.)

self.addEventListener('message', event => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleLocalReminders();
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

let reminderTimers = [];

function scheduleLocalReminders() {
  // Clear existing timers
  reminderTimers.forEach(clearTimeout);
  reminderTimers = [];

  const now = new Date();

  const targets = [
    { hour: 7,  minute: 0,  msg: '🌅 Good morning! Start your study session strong.' },
    { hour: 19, minute: 0,  msg: '🌙 Evening session time. Revise 2 old topics before starting new ones.' }
  ];

  for (const t of targets) {
    const next = new Date(now);
    next.setHours(t.hour, t.minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1); // schedule for tomorrow if past

    const delay = next - now;

    const timer = setTimeout(() => {
      self.registration.showNotification('JEEPrep — Study Reminder', {
        body:    t.msg,
        icon:    '/icons/icon-192.png',
        badge:   '/icons/icon-96.png',
        tag:     `reminder-${t.hour}`,
        vibrate: [100, 50, 100],
        data:    { url: '/' },
        actions: [
          { action: 'open',   title: '📖 Open JEEPrep' },
          { action: 'dismiss',title: '🔕 Dismiss' }
        ]
      });
      // Reschedule for tomorrow
      scheduleLocalReminders();
    }, delay);

    reminderTimers.push(timer);
  }
}

// Auto-schedule on SW startup
scheduleLocalReminders();

/* ─────────────────────────────────────────────────────────────────────────────
   HOW TO REGISTER THIS SERVICE WORKER
   Add this to src/main.jsx (or wherever you call ReactDOM.createRoot):

   if ('serviceWorker' in navigator) {
     window.addEventListener('load', async () => {
       try {
         const reg = await navigator.serviceWorker.register('/sw.js');
         console.log('[SW] registered:', reg.scope);

         // Ask permission for notifications
         if (Notification.permission === 'default') {
           const perm = await Notification.requestPermission();
           if (perm === 'granted') {
             reg.active?.postMessage({ type: 'SCHEDULE_NOTIFICATIONS' });
           }
         } else if (Notification.permission === 'granted') {
           reg.active?.postMessage({ type: 'SCHEDULE_NOTIFICATIONS' });
         }
       } catch (err) {
         console.error('[SW] registration failed:', err);
       }
     });
   }

   HOW TO ADD TO index.html (in public/):
   <link rel="manifest" href="/manifest.json" />
   <meta name="theme-color" content="#6366f1" />
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
   <meta name="apple-mobile-web-app-title" content="JEEPrep" />
   <link rel="apple-touch-icon" href="/icons/icon-192.png" />

   ICON GENERATION:
   Create a single 512×512 source icon (logo on transparent background),
   then run:  npx pwa-asset-generator logo.png public/icons --manifest public/manifest.json
   This auto-generates all icon sizes and injects them into manifest.json.
───────────────────────────────────────────────────────────────────────────── */
