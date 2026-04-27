import React, { useMemo, useState } from 'react';
import { Card, SectionTitle, Modal, useToast, Empty } from '../components/UI.jsx';
import { SYLLABUS, BRANCHES, WEIGHT_RANK } from '../data/syllabus.js';
import { setState, tickStreak, todayISO } from '../lib/storage.js';
import { generateFlashcards } from '../lib/ai.js';
import {
  Search, Filter, Check, CircleDashed, CircleDot, AlertTriangle, Sparkles,
  ChevronDown, ChevronRight, Brain, Layers, BookOpen
} from 'lucide-react';

const STATUS = [
  { id: 'todo', label: 'To-do', cls: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200', icon: CircleDashed },
  { id: 'doing', label: 'Doing', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', icon: CircleDot },
  { id: 'done', label: 'Done', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', icon: Check }
];

export default function Syllabus({ go, state }){
  const toast = useToast();
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('all');      // 'all' | '11' | '12'
  const [branch, setBranch] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openBranch, setOpenBranch] = useState({ physical: true, organic: true, inorganic: true });

  const [genOpen, setGenOpen] = useState(false);
  const [genTopic, setGenTopic] = useState(null);
  const [genCount, setGenCount] = useState(12);
  const [genLevel, setGenLevel] = useState('JEE Main');
  const [genLoading, setGenLoading] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SYLLABUS.filter(t => {
      if (cls !== 'all' && String(t.cls) !== cls) return false;
      if (branch !== 'all' && t.branch !== branch) return false;
      if (statusFilter !== 'all'){
        const s = state.syllabus[t.id]?.status || 'todo';
        if (s !== statusFilter) return false;
      }
      if (needle){
        const hay = (t.name + ' ' + t.subs.join(' ') + ' ' + (t.traps || '')).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, cls, branch, statusFilter, state]);

  const byBranch = useMemo(() => {
    const m = { physical: [], organic: [], inorganic: [] };
    for (const t of filtered) m[t.branch]?.push(t);
    // sort by weight then name
    for (const k of Object.keys(m)){
      m[k].sort((a, b) => (WEIGHT_RANK[b.weight] || 0) - (WEIGHT_RANK[a.weight] || 0) || a.name.localeCompare(b.name));
    }
    return m;
  }, [filtered]);

  const updateTopic = (t, patch) => {
    const next = { syllabus: { [t.id]: { ...(state.syllabus[t.id] || {}), ...patch, lastStudied: todayISO() } } };
    setState(next);
    tickStreak();
  };

  const setStatus = (t, id) => {
    updateTopic(t, { status: id });
    toast.push(`Marked "${t.name}" as ${id}`, 'success');
  };

  const setConfidence = (t, v) => updateTopic(t, { confidence: v });

  const openGen = (t) => { setGenTopic(t); setGenOpen(true); };

  const runGen = async () => {
    if (!genTopic) return;
    setGenLoading(true);
    try {
      const cards = await generateFlashcards(genTopic, Math.max(4, Math.min(30, genCount)), genLevel);
      const now = Date.now();
      const newCards = cards.map((c, i) => ({
        id: `${genTopic.id}-${now}-${i}`,
        topicId: genTopic.id,
        front: c.front,
        back: c.back,
        ease: 2.5, reps: 0, interval: 0, next: now
      }));
      setState(s => ({ flashcards: [...s.flashcards, ...newCards] }));
      toast.push(`Generated ${newCards.length} cards for ${genTopic.name}`, 'success');
      setGenOpen(false);
      setTimeout(() => go('flashcards'), 400);
    } catch (e){
      toast.push(e.message || 'AI generation failed', 'error');
    } finally {
      setGenLoading(false);
    }
  };

  const startQuiz = (t) => {
    location.hash = `#quiz?topic=${t.id}`;
    go('quiz');
  };

  return (
    <div>
      <SectionTitle
        title="Syllabus tracker"
        subtitle="Mark what's done, capture your confidence, and spot backlogs early. Generate flashcards or quiz yourself from any topic."
      />

      {/* Filters */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search topics, subtopics, or traps…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select className="input w-auto" value={cls} onChange={e => setCls(e.target.value)}>
              <option value="all">All classes</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
            <select className="input w-auto" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="all">All branches</option>
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select className="input w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Any status</option>
              <option value="todo">To-do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Branch sections */}
      {BRANCHES.map(b => {
        const items = byBranch[b.id];
        if (!items.length) return null;
        const open = openBranch[b.id];
        const doneCount = items.filter(t => state.syllabus[t.id]?.status === 'done').length;
        return (
          <section key={b.id} className="mb-5">
            <button
              onClick={() => setOpenBranch(o => ({ ...o, [b.id]: !o[b.id] }))}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <div className="flex items-center gap-2">
                {open ? <ChevronDown className="w-5 h-5 text-ink-400" /> : <ChevronRight className="w-5 h-5 text-ink-400" />}
                <h2 className="text-lg sm:text-xl font-display font-bold capitalize">{b.name} chemistry</h2>
                <span className="text-xs text-ink-500">· {doneCount}/{items.length} done</span>
              </div>
            </button>

            {open && (
              <div className="grid md:grid-cols-2 gap-3">
                {items.map(t => (
                  <TopicCard
                    key={t.id}
                    topic={t}
                    st={state.syllabus[t.id]}
                    onStatus={id => setStatus(t, id)}
                    onConfidence={v => setConfidence(t, v)}
                    onGen={() => openGen(t)}
                    onQuiz={() => startQuiz(t)}
                    onTutor={() => { location.hash = `#tutor?topic=${t.id}`; go('tutor'); }}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {filtered.length === 0 && (
        <Empty icon="🔎" title="No topics match those filters" hint="Try clearing the search or switching class." />
      )}

      {/* Generation modal */}
      <Modal
        open={genOpen}
        onClose={() => !genLoading && setGenOpen(false)}
        title={`Generate flashcards — ${genTopic?.name || ''}`}
        size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setGenOpen(false)} disabled={genLoading}>Cancel</button>
            <button className="btn-primary" onClick={runGen} disabled={genLoading}>
              {genLoading ? 'Generating…' : <> <Sparkles className="w-4 h-4" /> Generate </>}
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-300">
          Prof. Arjun will generate JEE-style cards across the sub-topics. You can review them in Flashcards next.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label className="label">Count</label>
            <input type="number" min="4" max="30" className="input mt-1" value={genCount} onChange={e => setGenCount(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Level</label>
            <select className="input mt-1" value={genLevel} onChange={e => setGenLevel(e.target.value)}>
              <option>JEE Main</option>
              <option>JEE Advanced</option>
              <option>NEET</option>
            </select>
          </div>
        </div>
        <p className="text-[11px] text-ink-500 mt-3">Uses your configured AI provider (default Gemini — free tier).</p>
      </Modal>
    </div>
  );
}

function TopicCard({ topic, st, onStatus, onConfidence, onGen, onQuiz, onTutor }){
  const status = st?.status || 'todo';
  const conf = st?.confidence || 0;
  const statusMeta = STATUS.find(x => x.id === status) || STATUS[0];
  const StatusIcon = statusMeta.icon;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`chip ${statusMeta.cls}`}><StatusIcon className="w-3 h-3" />{statusMeta.label}</span>
            <span className="chip chip-brand">{topic.weight}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-500 uppercase tracking-wide">Class {topic.cls}</span>
          </div>
          <h3 className="font-semibold mt-2 leading-snug">{topic.name}</h3>
          <p className="text-xs text-ink-500 mt-1 line-clamp-2">{topic.subs.join(' · ')}</p>
        </div>
      </div>

      {topic.traps && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-900 dark:text-amber-200 leading-relaxed">{topic.traps}</p>
        </div>
      )}

      {/* Status switcher */}
      <div className="mt-3 flex gap-1 flex-wrap">
        {STATUS.map(s => (
          <button
            key={s.id}
            onClick={() => onStatus(s.id)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition ${
              status === s.id
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-ink-200 dark:border-ink-700 hover:border-ink-300 dark:hover:border-ink-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Confidence dots */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] text-ink-500">Confidence</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              onClick={() => onConfidence(i)}
              className={`w-5 h-5 rounded-full transition ${
                i <= conf
                  ? 'bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm'
                  : 'bg-ink-200 dark:bg-ink-700 hover:bg-ink-300 dark:hover:bg-ink-600'
              }`}
              title={`${i}/5`}
            />
          ))}
        </div>
        {st?.lastStudied && (
          <span className="ml-auto text-[11px] text-ink-400">Last: {new Date(st.lastStudied).toLocaleDateString()}</span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn-secondary text-xs" onClick={onGen}>
          <Layers className="w-3.5 h-3.5" /> Flashcards
        </button>
        <button className="btn-secondary text-xs" onClick={onQuiz}>
          <Brain className="w-3.5 h-3.5" /> Quiz
        </button>
        <button className="btn-ghost text-xs" onClick={onTutor}>
          <Sparkles className="w-3.5 h-3.5" /> Ask Prof. Arjun
        </button>
      </div>
    </Card>
  );
}
