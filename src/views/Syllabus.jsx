import React, { useMemo, useState } from 'react';
import { Card, SectionTitle, Modal, useToast, Empty } from '../components/UI.jsx';
import { topicsFor, branchesFor, WEIGHT_RANK, subjectName } from '../data/syllabus.js';
import { setState, tickStreak, todayISO } from '../lib/storage.js';
import { generateFlashcards } from '../lib/ai.js';
import {
  Search, Check, CircleDashed, CircleDot, AlertTriangle, Sparkles,
  ChevronDown, ChevronRight, Brain, Layers
} from 'lucide-react';

const STATUS = [
  { id: 'todo', label: 'To-do', cls: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200', icon: CircleDashed },
  { id: 'doing', label: 'Doing', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', icon: CircleDot },
  { id: 'done', label: 'Done', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', icon: Check }
];

export default function Syllabus({ go, state }){
  const toast = useToast();
  const subject = state.profile?.subject || 'chemistry';
  const SYLLABUS = topicsFor(subject);
  const BRANCHES = branchesFor(subject);

  const [q, setQ] = useState('');
  const [cls, setCls] = useState('all');
  const [branch, setBranch] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openBranch, setOpenBranch] = useState(() => {
    const o = {};
    for (const b of BRANCHES) o[b.id] = true;
    return o;
  });

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
  }, [q, cls, branch, statusFilter, state, SYLLABUS]);

  const byBranch = useMemo(() => {
    const m = {};
    for (const b of BRANCHES) m[b.id] = [];
    for (const t of filtered) (m[t.branch] = m[t.branch] || []).push(t);
    for (const k of Object.keys(m)){
      m[k].sort((a, b) => (WEIGHT_RANK[b.weight] || 0) - (WEIGHT_RANK[a.weight] || 0) || a.name.localeCompare(b.name));
    }
    return m;
  }, [filtered, BRANCHES]);

  const updateTopic = (t, patch) => {
    setState({ syllabus: { [t.id]: { ...state.syllabus[t.id], ...patch, lastStudied: todayISO() } } });
    if (patch.status === 'done' || patch.status === 'doing') tickStreak();
  };

  const openGenerate = (topic) => {
    setGenTopic(topic);
    setGenCount(12);
    setGenLevel('JEE Main');
    setGenOpen(true);
  };

  const doGenerate = async () => {
    if (!genTopic) return;
    setGenLoading(true);
    try {
      const cards = await generateFlashcards(genTopic, genCount, genLevel);
      const now = new Date().toISOString();
      const newCards = cards.map(c => ({
        id: Math.random().toString(36).slice(2, 10),
        topicId: genTopic.id,
        subject: genTopic.subject,
        front: c.front, back: c.back,
        ease: 2.5, reps: 0, interval: 1,
        next: now,
        created: now
      }));
      setState({ flashcards: [...state.flashcards, ...newCards] });
      toast.push(`Generated ${newCards.length} cards. Review them in Flashcards.`, 'success');
      setGenOpen(false);
    } catch (e){
      toast.push(e.message || 'Generation failed', 'error');
    } finally {
      setGenLoading(false);
    }
  };

  const totalCount = filtered.length;
  const doneCount = filtered.filter(t => state.syllabus[t.id]?.status === 'done').length;

  return (
    <div>
      <SectionTitle
        title={`Syllabus — ${subjectName(subject)}`}
        subtitle="Pick one topic, mark progress honestly, generate cards or a quiz when you're ready."
      />

      {/* Filters */}
      <Card className="mb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input className="input pl-9" placeholder="Search topics, subtopics, traps…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="input" value={cls} onChange={e => setCls(e.target.value)}>
            <option value="all">All classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
          <select className="input" value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="all">All branches</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            {STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div className="text-xs text-ink-500 mt-2">{doneCount} / {totalCount} topics done in this view.</div>
      </Card>

      {/* Branches */}
      {BRANCHES.map(b => {
        const list = byBranch[b.id] || [];
        if (!list.length) return null;
        const open = !!openBranch[b.id];
        return (
          <div key={b.id} className="mb-5">
            <button
              onClick={() => setOpenBranch({ ...openBranch, [b.id]: !open })}
              className="flex items-center gap-2 mb-2 group"
            >
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <h3 className="font-semibold font-display text-lg">{b.name}</h3>
              <span className="text-xs text-ink-400">({list.length})</span>
            </button>
            {open && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map(t => (
                  <TopicCard
                    key={t.id}
                    t={t}
                    st={state.syllabus[t.id]}
                    onStatus={(status) => updateTopic(t, { status })}
                    onConfidence={(c) => updateTopic(t, { confidence: c })}
                    onGen={() => openGenerate(t)}
                    onQuiz={() => go(`quiz?topic=${t.id}`)}
                    onTutor={() => go(`tutor?topic=${t.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {!totalCount && <Empty icon="📚" title="No topics match these filters" hint="Loosen the filters or clear the search box." />}

      {/* Generate flashcards modal */}
      <Modal
        open={genOpen}
        onClose={() => !genLoading && setGenOpen(false)}
        title={genTopic ? `Generate flashcards — ${genTopic.name}` : 'Generate flashcards'}
        size="sm"
        footer={
          <>
            <button className="btn-ghost" disabled={genLoading} onClick={() => setGenOpen(false)}>Cancel</button>
            <button className="btn-primary" disabled={genLoading} onClick={doGenerate}>
              {genLoading ? 'Generating…' : <><Sparkles className="w-4 h-4" /> Generate</>}
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-300 mb-3">
          Your AI tutor will generate JEE-style cards across the sub-topics. Review them in Flashcards next.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">How many?</label>
            <input type="number" className="input mt-1" min="4" max="30" value={genCount} onChange={e => setGenCount(Number(e.target.value) || 12)} />
          </div>
          <div>
            <label className="label">Level</label>
            <select className="input mt-1" value={genLevel} onChange={e => setGenLevel(e.target.value)}>
              <option value="JEE Main">JEE Main</option>
              <option value="JEE Advanced">JEE Advanced</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TopicCard({ t, st, onStatus, onConfidence, onGen, onQuiz, onTutor }){
  const status = st?.status || 'todo';
  const conf = st?.confidence || 0;
  const meta = STATUS.find(s => s.id === status) || STATUS[0];
  const StatusIcon = meta.icon;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-semibold leading-snug">{t.name}</h4>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-500">
            <span>Class {t.cls}</span>
            <span>·</span>
            <span className="font-medium">{t.weight}</span>
          </div>
        </div>
        <span className={`chip ${meta.cls}`}><StatusIcon className="w-3.5 h-3.5" /> {meta.label}</span>
      </div>

      {/* Subtopics */}
      <div className="flex flex-wrap gap-1 mb-2">
        {t.subs.slice(0, 5).map((s, i) => (
          <span key={i} className="text-[11px] px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">{s}</span>
        ))}
      </div>

      {/* Trap warning */}
      {t.traps && (
        <p className="text-[11px] text-amber-700 dark:text-amber-300 italic flex gap-1 items-start">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{t.traps}</span>
        </p>
      )}

      {/* Status pills */}
      <div className="mt-3 flex gap-1">
        {STATUS.map(s => (
          <button
            key={s.id}
            onClick={() => onStatus(s.id)}
            className={`text-xs px-2 py-1 rounded-md font-medium ${status === s.id ? s.cls + ' ring-1 ring-offset-1 ring-current/30' : 'bg-ink-50 dark:bg-ink-900 text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'}`}
          >{s.label}</button>
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
        <button className="btn-secondary text-xs ml-auto" onClick={onTutor}>
          <Sparkles className="w-3.5 h-3.5" /> Ask the tutor
        </button>
      </div>
    </Card>
  );
}
