import React, { useMemo, useState } from 'react';
import { Card, SectionTitle, Modal, MD, useToast, Empty } from '../components/UI.jsx';
import { setState, tickStreak } from '../lib/storage.js';
import { topicsFor, topicById } from '../data/syllabus.js';
import { grade, dueNow } from '../lib/srs.js';
import { generateFlashcards } from '../lib/ai.js';
import {
  Layers, Sparkles, RotateCcw, Check, X, ChevronLeft, ChevronRight,
  Trash2, Filter, AlertCircle
} from 'lucide-react';

export default function Flashcards({ state }){
  const subject = state.profile && state.profile.subject ? state.profile.subject : "chemistry";
  const SYLLABUS = topicsFor(subject);
  const toast = useToast();
  const [topicFilter, setTopicFilter] = useState('all');
  const [mode, setMode] = useState('review'); // review | all
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [genOpen, setGenOpen] = useState(false);
  const [genTopic, setGenTopic] = useState(SYLLABUS[0].id);
  const [genCount, setGenCount] = useState(12);
  const [genLoading, setGenLoading] = useState(false);

  const deck = useMemo(() => {
    let pool = state.flashcards;
    if (topicFilter !== 'all') pool = pool.filter(c => c.topicId === topicFilter);
    if (mode === 'review') pool = dueNow(pool);
    return pool;
  }, [state.flashcards, topicFilter, mode]);

  const current = deck[i] || null;

  const onGrade = (q) => {
    if (!current) return;
    const upd = grade(current, q);
    setState(s => ({ flashcards: s.flashcards.map(c => c.id === upd.id ? upd : c) }));
    tickStreak();
    setFlipped(false);
    if (i + 1 >= deck.length) {
      toast.push('Deck cleared. Great focus.', 'success');
      setI(0);
    } else {
      setI(i + 1);
    }
  };

  const onNext = () => { setFlipped(false); setI(Math.min(deck.length - 1, i + 1)); };
  const onPrev = () => { setFlipped(false); setI(Math.max(0, i - 1)); };

  const deleteCard = (id) => {
    if (!confirm('Delete this card?')) return;
    setState(s => ({ flashcards: s.flashcards.filter(c => c.id !== id) }));
    toast.push('Deleted', 'info');
    if (i >= deck.length - 1) setI(Math.max(0, deck.length - 2));
  };

  const runGen = async () => {
    const topic = topicById(genTopic);
    if (!topic) return;
    setGenLoading(true);
    try {
      const cards = await generateFlashcards(topic, Math.max(4, Math.min(30, genCount)));
      const now = Date.now();
      const newCards = cards.map((c, k) => ({
        id: `${topic.id}-${now}-${k}`,
        topicId: topic.id,
        front: c.front,
        back: c.back,
        ease: 2.5, reps: 0, interval: 0, next: now
      }));
      setState(s => ({ flashcards: [...s.flashcards, ...newCards] }));
      toast.push(`Added ${newCards.length} cards.`, 'success');
      setGenOpen(false);
    } catch (e){
      toast.push(e.message || 'Generation failed', 'error');
    } finally {
      setGenLoading(false);
    }
  };

  const totalCards = state.flashcards.length;
  const dueCount = dueNow(state.flashcards).length;

  return (
    <div>
      <SectionTitle
        title="Flashcards"
        subtitle="Spaced repetition (SM-2). Active recall beats re-reading. Always."
        actions={
          <>
            <button className="btn-primary" onClick={() => setGenOpen(true)}>
              <Sparkles className="w-4 h-4" /> Generate with AI
            </button>
          </>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card><div className="label">Total</div><div className="text-2xl font-display font-bold">{totalCards}</div></Card>
        <Card><div className="label">Due now</div><div className="text-2xl font-display font-bold text-amber-600">{dueCount}</div></Card>
        <Card><div className="label">Topics</div><div className="text-2xl font-display font-bold">{new Set(state.flashcards.map(c => c.topicId)).size}</div></Card>
      </div>

      {/* Filters */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-400" />
            <select className="input w-auto" value={topicFilter} onChange={e => { setTopicFilter(e.target.value); setI(0); }}>
              <option value="all">All topics</option>
              {SYLLABUS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select className="input w-auto" value={mode} onChange={e => { setMode(e.target.value); setI(0); }}>
              <option value="review">Due only</option>
              <option value="all">All in deck</option>
            </select>
          </div>
          <div className="text-xs text-ink-500 ml-auto">{deck.length} card{deck.length === 1 ? '' : 's'} in this deck</div>
        </div>
      </Card>

      {/* Card area */}
      {deck.length === 0 ? (
        <Empty
          icon="🃏"
          title="No cards to review"
          hint={totalCards === 0 ? "Generate your first deck with AI." : "Nothing is due. Come back tomorrow or switch to 'All in deck'."}
          action={totalCards === 0 && <button className="btn-primary" onClick={() => setGenOpen(true)}><Sparkles className="w-4 h-4" />Generate</button>}
        />
      ) : current && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-ink-500">Card {i + 1} / {deck.length}</div>
            <div className="text-xs text-ink-500 truncate max-w-[60%]" title={topicById(current.topicId)?.name}>
              {topicById(current.topicId)?.name || 'Topic'}
            </div>
          </div>

          <div
            className="card p-6 sm:p-8 min-h-[220px] flex items-center justify-center text-center cursor-pointer select-none"
            onClick={() => setFlipped(f => !f)}
          >
            {!flipped ? (
              <div>
                <div className="text-[11px] text-ink-400 uppercase tracking-wider mb-2">Front</div>
                <div className="text-lg sm:text-xl font-medium">{current.front}</div>
                <div className="text-[11px] text-ink-400 mt-4">Tap to flip</div>
              </div>
            ) : (
              <div className="text-left w-full">
                <div className="text-[11px] text-ink-400 uppercase tracking-wider mb-2 text-center">Back</div>
                <MD className="text-sm sm:text-base">{current.back}</MD>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-2">
            <button className="btn-ghost" onClick={onPrev}><ChevronLeft className="w-4 h-4" /></button>
            <button className="btn-ghost" onClick={() => setFlipped(f => !f)}><RotateCcw className="w-4 h-4" />Flip</button>
            <button className="btn-ghost ml-auto" onClick={() => deleteCard(current.id)}>
              <Trash2 className="w-4 h-4 text-rose-500" />
            </button>
            <button className="btn-ghost" onClick={onNext}><ChevronRight className="w-4 h-4" /></button>
          </div>

          {/* Grade buttons — only visible after flipping */}
          {flipped && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              <button className="btn-ghost border border-rose-300 text-rose-600" onClick={() => onGrade(0)}>
                <X className="w-4 h-4" />Again
              </button>
              <button className="btn-ghost border border-amber-300 text-amber-700" onClick={() => onGrade(3)}>
                Hard
              </button>
              <button className="btn-ghost border border-emerald-300 text-emerald-700" onClick={() => onGrade(4)}>
                <Check className="w-4 h-4" />Good
              </button>
              <button className="btn-ghost border border-brand-300 text-brand-700" onClick={() => onGrade(5)}>
                Easy
              </button>
            </div>
          )}

          {!flipped && (
            <div className="mt-4 p-2.5 rounded-lg bg-ink-100 dark:bg-ink-800 text-xs text-ink-500 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Try to answer before flipping. Recall itself is the workout — seeing the answer is just the correction.</span>
            </div>
          )}
        </div>
      )}

      {/* Generation modal */}
      <Modal
        open={genOpen}
        onClose={() => !genLoading && setGenOpen(false)}
        title="Generate flashcards"
        size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setGenOpen(false)} disabled={genLoading}>Cancel</button>
            <button className="btn-primary" onClick={runGen} disabled={genLoading}>
              {genLoading ? 'Generating…' : <> <Sparkles className="w-4 h-4" />Generate </>}
            </button>
          </>
        }
      >
        <div>
          <label className="label">Topic</label>
          <select className="input mt-1" value={genTopic} onChange={e => setGenTopic(e.target.value)}>
            {SYLLABUS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="mt-3">
          <label className="label">Number of cards</label>
          <input type="number" min="4" max="30" className="input mt-1" value={genCount} onChange={e => setGenCount(Number(e.target.value))} />
        </div>
      </Modal>
    </div>
  );
}
