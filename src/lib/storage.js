// Persistent state layer — namespaced localStorage with safe merges + simple pub/sub
const KEY = 'chemprep:state:v2';

export const DEFAULT_STATE = {
  profile: {
    name: '',
    cls: 12,
    targetDate: '',
    weekTargetMins: 1500,
    screenCapMins: 90
  },
  settings: {
    provider: 'groq',                // groq (recommended) | openrouter | gemini | anthropic
    geminiKey: '',
    geminiModel: 'gemini-2.5-flash', // kept mainly for image doubts (vision)
    groqKey: '',
    groqModel: 'llama-3.3-70b-versatile',
    openrouterKey: '',
    openrouterModel: 'deepseek/deepseek-r1:free',
    anthropicKey: '',
    anthropicModel: 'claude-sonnet-4-6',
    useProxy: false                  // if true, the app calls /api/* instead of provider APIs
  },
  syllabus: {},                      // topicId -> { status, confidence, lastStudied, notes }
  planner: {
    weekly: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    logs: {}                         // 'YYYY-MM-DD' -> { studiedMins, screenMins, notes }
  },
  flashcards: [],                    // { id, topicId, front, back, ease, reps, interval, next }
  quizHistory: [],                   // { id, topicId, score, total, date, diff }
  groups: [],                        // { id, name, code, members: [{name, minsThisWeek}] }
  chat: [],                          // { role, content, image? }
  streak: { count: 0, lastDate: '' },
  createdAt: null
};

function clone(o){ return JSON.parse(JSON.stringify(o)); }
function deepMerge(base, incoming){
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return incoming ?? base;
  const out = Array.isArray(base) ? base.slice() : { ...base };
  for (const k of Object.keys(incoming)){
    const bv = base ? base[k] : undefined;
    const iv = incoming[k];
    if (iv && typeof iv === 'object' && !Array.isArray(iv) && bv && typeof bv === 'object' && !Array.isArray(bv)){
      out[k] = deepMerge(bv, iv);
    } else {
      out[k] = iv;
    }
  }
  return out;
}

let state = load();
const listeners = new Set();

function load(){
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
    const merged = deepMerge(clone(DEFAULT_STATE), stored);
    if (!merged.createdAt) merged.createdAt = new Date().toISOString();
    return merged;
  } catch {
    return clone(DEFAULT_STATE);
  }
}

function persist(){
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function getState(){ return state; }

/** Patch with an object or a function(state)=>patch; triggers subscribers. */
export function setState(patch){
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = deepMerge(state, next);
  persist();
  for (const l of listeners) l(state);
}

/** Replace the whole state (used by Import). */
export function replaceState(newState){
  state = deepMerge(clone(DEFAULT_STATE), newState || {});
  persist();
  for (const l of listeners) l(state);
}

/** Subscribe to state changes; returns an unsubscribe fn. */
export function subscribe(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetState(){
  state = clone(DEFAULT_STATE);
  state.createdAt = new Date().toISOString();
  persist();
  for (const l of listeners) l(state);
}

/* ---------- Derived helpers ---------- */
export const todayISO = () => new Date().toISOString().slice(0, 10);

export function weekRange(d = new Date()){
  const day = d.getDay(); // 0 Sun..6 Sat
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  const dates = [];
  for (let i = 0; i < 7; i++){
    const k = new Date(monday); k.setDate(monday.getDate() + i);
    dates.push(k.toISOString().slice(0, 10));
  }
  return dates;
}

export function weekMinutes(){
  const { planner } = state;
  return weekRange().reduce((sum, d) => sum + (planner.logs[d]?.studiedMins || 0), 0);
}

export function tickStreak(){
  const t = todayISO();
  const { streak } = state;
  if (streak.lastDate === t) return;
  const prev = streak.lastDate ? new Date(streak.lastDate) : null;
  const today = new Date(t);
  const gap = prev ? Math.round((today - prev) / 86400000) : null;
  let count;
  if (gap === 1) count = streak.count + 1;
  else count = 1;
  setState({ streak: { count, lastDate: t } });
}
