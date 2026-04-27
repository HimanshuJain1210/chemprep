import React, { useMemo } from 'react';
import { Card, ProgressBar, SectionTitle } from '../components/UI.jsx';
import { SYLLABUS, BRANCHES, topicById } from '../data/syllabus.js';
import { DAILY_TIPS } from '../data/formulas.js';
import { dueNow } from '../lib/srs.js';
import { getState, weekRange, weekMinutes } from '../lib/storage.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Flame, Target, TrendingUp, Clock, ArrowRight, AlertTriangle, Sparkles, PlayCircle, Phone } from 'lucide-react';

export default function Dashboard({ go, state }){
  const s = state;
  const totalTopics = SYLLABUS.length;
  const doneCount = SYLLABUS.filter(t => s.syllabus[t.id]?.status === 'done').length;
  const overallPct = Math.round((doneCount / totalTopics) * 100);

  const due = dueNow(s.flashcards);

  const focus = useMemo(() => suggestFocus(s), [s]);
  const backlogs = useMemo(() => getBacklogs(s), [s]);

  const weekData = useMemo(() => {
    const dates = weekRange();
    return dates.map(d => ({
      d: new Date(d).toLocaleDateString(undefined, { weekday: 'short' }),
      mins: s.planner.logs[d]?.studiedMins || 0
    }));
  }, [s]);

  const weekMins = weekMinutes();
  const weekTarget = s.profile.weekTargetMins || 1500;
  const weekPct = Math.min(100, Math.round((weekMins / weekTarget) * 100));

  const daysLeft = s.profile.targetDate
    ? Math.max(0, Math.round((new Date(s.profile.targetDate) - new Date()) / 86400000))
    : null;

  const tip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];

  const branchStats = BRANCHES.map(b => {
    const all = SYLLABUS.filter(t => t.branch === b.id);
    const d = all.filter(t => s.syllabus[t.id]?.status === 'done').length;
    return { ...b, total: all.length, done: d, pct: Math.round((d / all.length) * 100) };
  });

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative card p-5 sm:p-6 overflow-hidden">
        <div className="hero-ring absolute inset-0 opacity-70 pointer-events-none" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">Hi {s.profile.name || 'there'} 👋</h1>
            <p className="text-ink-600 dark:text-ink-300 mt-1 text-sm sm:text-base max-w-2xl">
              <span className="italic">"{tip}"</span><br/>
              <span className="text-xs text-ink-400">— Prof. Arjun</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => go('planner')}><PlayCircle className="w-4 h-4"/>Plan today</button>
            {due.length > 0 && <button className="btn-accent" onClick={() => go('flashcards')}>Review {due.length} cards</button>}
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="label">Overall syllabus</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-3xl font-display font-bold mt-1">{overallPct}%</div>
          <ProgressBar value={overallPct} className="mt-2" />
          <div className="text-xs text-ink-500 mt-1">{doneCount} of {totalTopics} topics done</div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="label">This week</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-display font-bold mt-1">{weekMins}<span className="text-sm text-ink-500 font-sans font-normal ml-1">min</span></div>
          <ProgressBar value={weekPct} className="mt-2" />
          <div className="text-xs text-ink-500 mt-1">Target {weekTarget} min ({weekPct}%)</div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="label">Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-display font-bold mt-1">{s.streak?.count || 0} <span className="text-sm font-normal text-ink-500">days</span></div>
          <div className="text-xs text-ink-500 mt-2">Show up tomorrow too. Compounding kicks in after 14 days.</div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="label">Days to target</span>
            <Target className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-display font-bold mt-1">{daysLeft ?? '—'}</div>
          {s.profile.targetDate
            ? <div className="text-xs text-ink-500 mt-2">Target: {new Date(s.profile.targetDate).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}</div>
            : <button onClick={() => go('settings')} className="text-xs text-brand-600 hover:underline mt-2 inline-flex items-center gap-1">Set target date <ArrowRight className="w-3 h-3"/></button>}
        </Card>
      </div>

      {/* Focus + Backlog */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold font-display flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-500"/>Focus of the day</h3>
          </div>
          <p className="text-xs text-ink-500 mt-0.5 mb-3">Picked using due cards, low-confidence dones, and your backlogs — the order a senior mentor would pick.</p>
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {focus.length === 0 && <p className="text-sm text-ink-500 py-2">All caught up. Revise your formulas for 10 minutes, then open Flashcards.</p>}
            {focus.map(t => (
              <div key={t.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-ink-500">{t.reason}</div>
                </div>
                <button className="btn-secondary text-xs" onClick={() => { location.hash = '#syllabus'; }}>
                  Open <ArrowRight className="w-3 h-3"/>
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500"/>
            <h3 className="font-semibold font-display">Backlogs</h3>
          </div>
          <p className="text-xs text-ink-500 mt-0.5 mb-3">Topics you started 14+ days ago and haven't touched. Clear one a day.</p>
          {backlogs.length === 0
            ? <p className="text-sm text-ink-500">Nothing piled up. Stay disciplined.</p>
            : (
              <ul className="space-y-2">
                {backlogs.slice(0, 6).map(t => (
                  <li key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-[11px] text-ink-500">Since {new Date(s.syllabus[t.id].lastStudied).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => go('syllabus')} className="btn-ghost text-xs">Resume</button>
                  </li>
                ))}
              </ul>
            )}
        </Card>
      </div>

      {/* Charts + branch breakdown + Screen-time */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold font-display">Minutes studied this week</h3>
          <div className="h-44 sm:h-52 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} vertical={false} />
                <XAxis dataKey="d" stroke="currentColor" strokeOpacity={0.5} fontSize={12} />
                <YAxis stroke="currentColor" strokeOpacity={0.5} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(100,116,139,.2)' }} />
                <Bar dataKey="mins" fill="#f97316" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold font-display">By branch</h3>
          <div className="space-y-3 mt-3">
            {branchStats.map(b => (
              <div key={b.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium capitalize">{b.name}</span>
                  <span>{b.done}/{b.total} · {b.pct}%</span>
                </div>
                <ProgressBar value={b.pct} />
              </div>
            ))}
          </div>
          <ScreenTime state={s} />
        </Card>
      </div>
    </div>
  );
}

function ScreenTime({ state }){
  const d = new Date().toISOString().slice(0,10);
  const mins = state.planner.logs[d]?.screenMins || 0;
  const cap = state.profile.screenCapMins || 0;
  const over = cap > 0 && mins > cap;
  return (
    <div className="mt-5 p-3 rounded-xl border border-ink-200 dark:border-ink-800">
      <div className="flex items-center gap-2 text-xs text-ink-500"><Phone className="w-3.5 h-3.5"/> Screen time today</div>
      <div className={`text-xl font-semibold mt-0.5 ${over ? 'text-rose-600' : ''}`}>{mins} min <span className="text-xs text-ink-500 font-normal">/ {cap} cap</span></div>
      {over && <div className="text-[11px] text-rose-600 mt-1">Over by {mins - cap} min. Tomorrow: phone in another room during study blocks.</div>}
    </div>
  );
}

function suggestFocus(s){
  const out = [];
  const seen = new Set();
  const push = (t, reason) => { if (!seen.has(t.id)) { seen.add(t.id); out.push({ ...t, reason }); } };

  // Due flashcards' topics
  const dueTopics = new Set(s.flashcards.filter(c => (c.next || 0) <= Date.now()).map(c => c.topicId));
  SYLLABUS.forEach(t => dueTopics.has(t.id) && push(t, 'Flashcards due — review first, new material second.'));

  // In progress
  SYLLABUS.forEach(t => {
    if (s.syllabus[t.id]?.status === 'doing') push(t, 'In progress — give it 45 min today.');
  });

  // Low confidence done
  SYLLABUS.forEach(t => {
    const st = s.syllabus[t.id];
    if (st?.status === 'done' && (st.confidence || 0) <= 2) push(t, 'Done but weak — do 10 MCQs to lock it in.');
  });

  // Next high-weight untouched
  const untouched = SYLLABUS.filter(t => !s.syllabus[t.id] && t.cls === s.profile.cls);
  untouched.sort((a, b) => weightScore(b) - weightScore(a));
  untouched.slice(0, 2).forEach(t => push(t, `New topic (weight: ${t.weight}) — start today.`));

  return out.slice(0, 5);
}
function weightScore(t){ return { 'Very High':4, High:3, Medium:2, Low:1 }[t.weight] || 0; }

function getBacklogs(s){
  const now = Date.now();
  return SYLLABUS.filter(t => {
    const st = s.syllabus[t.id];
    return st?.status === 'doing' && st.lastStudied && (now - new Date(st.lastStudied).getTime()) > 14 * 86400000;
  });
}
