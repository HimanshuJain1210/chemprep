import React, { useMemo, useState } from 'react';
import { Card, SectionTitle, Modal, useToast, Empty } from '../components/UI.jsx';
import { setState, tickStreak, todayISO, weekRange, getState } from '../lib/storage.js';
import { suggestWeekPlan } from '../lib/ai.js';
import { SYLLABUS, topicById } from '../data/syllabus.js';
import {
  Plus, Trash2, Sparkles, Save, CalendarDays, Clock, Phone, StickyNote,
  BookOpen, Coffee, School, Repeat, Eraser
} from 'lucide-react';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const KIND_META = {
  study:    { label: 'Study',    icon: BookOpen, cls: 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border-brand-500/30' },
  revision: { label: 'Revision', icon: Repeat,   cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  school:   { label: 'School',   icon: School,   cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' },
  break:    { label: 'Break',    icon: Coffee,   cls: 'bg-ink-200 text-ink-700 dark:bg-ink-700 dark:text-ink-200 border-ink-300 dark:border-ink-700' }
};

export default function Planner({ go, state }){
  const toast = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [addDay, setAddDay] = useState('Mon');
  const [block, setBlock] = useState({ time: '17:00', label: '', kind: 'study', topicId: '' });
  const [aiLoading, setAiLoading] = useState(false);

  const today = todayISO();
  const todayLog = state.planner.logs[today] || { studiedMins: 0, screenMins: 0, notes: '' };
  const weekTarget = state.profile.weekTargetMins || 1500;

  const weekMins = useMemo(() => {
    return weekRange().reduce((sum, d) => sum + (state.planner.logs[d]?.studiedMins || 0), 0);
  }, [state.planner.logs]);

  const blocksThisWeek = DAYS.reduce((n, d) => n + ((state.planner.weekly[d] || []).length), 0);

  const addBlock = () => {
    const existing = state.planner.weekly[addDay] || [];
    const nextList = [...existing, { id: Math.random().toString(36).slice(2, 9), ...block }]
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    setState({ planner: { weekly: { ...state.planner.weekly, [addDay]: nextList } } });
    setAddOpen(false);
    setBlock({ time: '17:00', label: '', kind: 'study', topicId: '' });
    toast.push(`Added to ${addDay}`, 'success');
  };

  const removeBlock = (day, id) => {
    const nextList = (state.planner.weekly[day] || []).filter(b => b.id !== id);
    setState({ planner: { weekly: { ...state.planner.weekly, [day]: nextList } } });
    toast.push('Removed', 'info');
  };

  const clearWeek = () => {
    if (blocksThisWeek === 0) {
      toast.push('Week is already empty.', 'info');
      return;
    }
    if (!confirm(`Clear all ${blocksThisWeek} block${blocksThisWeek === 1 ? '' : 's'} from this week? Your daily logs and streak stay safe.`)) return;
    setState({
      planner: {
        weekly: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
      }
    });
    toast.push('Week cleared. Ready for a fresh plan.', 'success');
  };

  const openAdd = (day) => {
    setAddDay(day);
    setAddOpen(true);
  };

  const aiSuggest = async () => {
    setAiLoading(true);
    try {
      const subject = state.profile?.subject || 'chemistry';
      const pending = SYLLABUS
        .filter(t => t.subject === subject)
        .filter(t => (state.syllabus[t.id]?.status || 'todo') !== 'done');
      const backlogs = pending
        .filter(t => state.syllabus[t.id]?.status === 'doing')
        .map(t => t.id);
      const raw = await suggestWeekPlan({
        pending, backlogs,
        weekTargetMins: weekTarget,
        cls: state.profile.cls,
        schoolStart: state.profile.schoolStart || '08:00',
        schoolEnd: state.profile.schoolEnd || '14:00',
        leaveDays: state.profile.leaveDays || [],
        subject
      });
      const plan = raw.weekly || raw.plan || raw;
      const weekly = {};
      for (const d of DAYS){
        const arr = Array.isArray(plan[d]) ? plan[d] : [];
        weekly[d] = arr
          .filter(b => b && b.time && b.label)
          .map(b => ({
            id: Math.random().toString(36).slice(2, 9),
            time: b.time,
            label: String(b.label).slice(0, 60),
            kind: ['study','revision','school','break'].includes(b.kind) ? b.kind : 'study',
            topicId: b.topicId && topicById(b.topicId) ? b.topicId : ''
          }))
          .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      }
      setState({ planner: { weekly } });
      toast.push('Your week is drafted. Review and tweak.', 'success');
    } catch (e){
      toast.push(e.message || 'AI plan failed', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const logToday = (patch) => {
    setState({ planner: { logs: { [today]: { ...todayLog, ...patch } } } });
    if ((patch.studiedMins || 0) > 0) tickStreak();
  };

  return (
    <div>
      <SectionTitle
        title="Planner"
        subtitle="Design your week, log what you studied, watch your screen time."
        actions={
          <>
            <button className="btn-ghost" onClick={clearWeek} disabled={aiLoading} title="Wipe every block from this week">
              <Eraser className="w-4 h-4" />
              Clear week
            </button>
            <button className="btn-secondary" onClick={aiSuggest} disabled={aiLoading}>
              <Sparkles className="w-4 h-4" />
              {aiLoading ? 'Drafting…' : 'AI draft my week'}
            </button>
          </>
        }
      />

      {/* School schedule — used by AI planner to respect real-life constraints */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <div className="label flex items-center gap-1"><School className="w-3.5 h-3.5" /> School / coaching hours</div>
            <div className="text-xs text-ink-500">Tell the AI when you're not available — it'll plan around it.</div>
          </div>
          <div>
            <label className="label">Start</label>
            <input type="time" className="input mt-1 w-28"
              value={state.profile?.schoolStart || '08:00'}
              onChange={e => setState({ profile: { schoolStart: e.target.value } })}
            />
          </div>
          <div>
            <label className="label">End</label>
            <input type="time" className="input mt-1 w-28"
              value={state.profile?.schoolEnd || '14:00'}
              onChange={e => setState({ profile: { schoolEnd: e.target.value } })}
            />
          </div>
          <div className="flex-1 min-w-[260px]">
            <label className="label">Off days (no school)</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {DAYS.map(d => {
                const off = (state.profile?.leaveDays || []).includes(d);
                return (
                  <button
                    key={d}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      off
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-ink-300 border-ink-200 dark:border-ink-700'
                    }`}
                    onClick={() => {
                      const cur = state.profile?.leaveDays || [];
                      const next = off ? cur.filter(x => x !== d) : [...cur, d];
                      setState({ profile: { leaveDays: next } });
                    }}
                  >{d}</button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Today log */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <div className="label">Today · {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</div>
            <div className="text-xs text-ink-500">Log honestly. Future you will thank you.</div>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="label flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Studied (min)</label>
              <input type="number" min="0" className="input w-32 mt-1"
                value={todayLog.studiedMins || 0}
                onChange={e => logToday({ studiedMins: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="label flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Screen time (min)</label>
              <input type="number" min="0" className="input w-32 mt-1"
                value={todayLog.screenMins || 0}
                onChange={e => logToday({ screenMins: Number(e.target.value) })}
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="label flex items-center gap-1"><StickyNote className="w-3.5 h-3.5" /> Note</label>
              <input type="text" className="input mt-1"
                placeholder="One line — what clicked today?"
                value={todayLog.notes || ''}
                onChange={e => logToday({ notes: e.target.value })}
              />
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[11px] text-ink-500">This week</div>
            <div className="text-2xl font-bold font-display">{weekMins}<span className="text-sm text-ink-500 font-normal ml-1">/ {weekTarget} min</span></div>
          </div>
        </div>
      </Card>

      {/* Weekly grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {DAYS.map(d => (
          <Card key={d} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold font-display">{d}</h3>
              </div>
              <button className="btn-ghost text-xs p-1.5" onClick={() => openAdd(d)} title="Add block">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {(state.planner.weekly[d] || []).length === 0 && (
                <p className="text-xs text-ink-400 italic py-2">No blocks yet.</p>
              )}
              {(state.planner.weekly[d] || []).map(b => {
                const meta = KIND_META[b.kind] || KIND_META.study;
                const Icon = meta.icon;
                const topic = b.topicId ? topicById(b.topicId) : null;
                return (
                  <div key={b.id} className={`p-2.5 rounded-lg border ${meta.cls}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] opacity-80">
                          <Icon className="w-3 h-3" />
                          <span>{b.time}</span>
                          <span>·</span>
                          <span>{meta.label}</span>
                        </div>
                        <div className="text-sm font-medium truncate">{b.label}</div>
                        {topic && <div className="text-[11px] opacity-70 truncate">{topic.name}</div>}
                      </div>
                      <button onClick={() => removeBlock(d, b.id)} className="p-1 rounded hover:bg-ink-100/40 dark:hover:bg-ink-800/40">
                        <Trash2 className="w-3.5 h-3.5 opacity-70" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Add block modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={`Add block — ${addDay}`}
        size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={addBlock}><Save className="w-4 h-4" />Save</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Time</label>
            <input type="time" className="input mt-1" value={block.time} onChange={e => setBlock({ ...block, time: e.target.value })} />
          </div>
          <div>
            <label className="label">Kind</label>
            <select className="input mt-1" value={block.kind} onChange={e => setBlock({ ...block, kind: e.target.value })}>
              {Object.entries(KIND_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="label">Label</label>
          <input className="input mt-1" placeholder="e.g. Electrochem numericals" value={block.label} onChange={e => setBlock({ ...block, label: e.target.value })} />
        </div>
        <div className="mt-3">
          <label className="label">Topic (optional)</label>
          <select className="input mt-1" value={block.topicId} onChange={e => setBlock({ ...block, topicId: e.target.value })}>
            <option value="">— none —</option>
            {SYLLABUS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </Modal>
    </div>
  );
}
