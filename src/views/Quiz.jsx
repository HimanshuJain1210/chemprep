import React, { useEffect, useState } from 'react';
import { Card, SectionTitle, Modal, MD, useToast, Empty } from '../components/UI.jsx';
import { setState, tickStreak } from '../lib/storage.js';
import { SYLLABUS, topicById } from '../data/syllabus.js';
import { generateMCQs } from '../lib/ai.js';
import { Brain, Sparkles, Check, X, RotateCcw, ChevronRight, Target, TrendingUp } from 'lucide-react';

export default function Quiz({ state }){
  const toast = useToast();
  const [topicId, setTopicId] = useState(() => paramFromHash('topic') || SYLLABUS[0].id);
  const [difficulty, setDifficulty] = useState('JEE Main');
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]); // [{correct, picked}]
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const hashTopic = paramFromHash('topic');
    if (hashTopic) setTopicId(hashTopic);
  }, []);

  const topic = topicById(topicId);

  const start = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const qs = await generateMCQs(topic, Math.max(4, Math.min(20, count)), difficulty);
      setQuestions(qs);
      setIdx(0); setPicked(null); setAnswers([]); setFinished(false);
      toast.push(`${qs.length} questions ready. Time yourself — don't peek.`, 'success');
    } catch (e){
      toast.push(e.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const lock = () => {
    if (picked === null) return;
    const q = questions[idx];
    const correct = picked === q.answer;
    const nextAnswers = [...answers, { correct, picked }];
    setAnswers(nextAnswers);
  };

  const next = () => {
    setPicked(null);
    if (idx + 1 >= questions.length){
      finish();
    } else {
      setIdx(idx + 1);
    }
  };

  const finish = () => {
    const score = answers.filter(a => a.correct).length;
    setState(s => ({
      quizHistory: [...s.quizHistory, {
        id: Math.random().toString(36).slice(2, 9),
        topicId: topic.id,
        score, total: questions.length,
        diff: difficulty,
        date: new Date().toISOString()
      }]
    }));
    tickStreak();
    setFinished(true);
  };

  const restart = () => {
    setQuestions([]); setAnswers([]); setIdx(0); setPicked(null); setFinished(false);
  };

  const score = answers.filter(a => a.correct).length;
  const currentQ = questions[idx];
  const isAnswered = answers.length > idx;

  const history = state.quizHistory.filter(h => h.topicId === topicId).slice(-5).reverse();

  return (
    <div>
      <SectionTitle
        title="Quiz (active recall)"
        subtitle="AI-generated MCQs with explanations. Close the notes. Give it a real shot."
      />

      {/* Setup */}
      {!questions.length && !finished && (
        <Card>
          <h3 className="font-semibold mb-3">Configure</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Topic</label>
              <select className="input mt-1" value={topicId} onChange={e => setTopicId(e.target.value)}>
                {SYLLABUS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="input mt-1" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option>JEE Main</option>
                <option>JEE Advanced</option>
                <option>NEET</option>
              </select>
            </div>
            <div>
              <label className="label">Number of questions</label>
              <input type="number" min="4" max="20" className="input mt-1" value={count} onChange={e => setCount(Number(e.target.value))} />
            </div>
          </div>
          {topic?.traps && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm">
              <span className="font-semibold text-amber-800 dark:text-amber-300">Trap to watch: </span>
              <span className="text-amber-900 dark:text-amber-200">{topic.traps}</span>
            </div>
          )}
          <div className="mt-4">
            <button className="btn-primary" onClick={start} disabled={loading}>
              {loading ? 'Generating…' : <> <Sparkles className="w-4 h-4" />Start quiz </>}
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" />Recent attempts on this topic</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {history.map(h => (
                  <div key={h.id} className="p-2.5 rounded-lg border border-ink-200 dark:border-ink-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{h.score}/{h.total} <span className="text-ink-500 font-normal text-xs">· {h.diff}</span></div>
                      <div className="text-[11px] text-ink-500">{new Date(h.date).toLocaleString()}</div>
                    </div>
                    <div className={`text-xs font-semibold ${h.score / h.total >= 0.7 ? 'text-emerald-600' : h.score / h.total >= 0.4 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {Math.round((h.score / h.total) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Question */}
      {currentQ && !finished && (
        <Card className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
            <span>Q {idx + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="text-base sm:text-lg font-medium">{currentQ.q}</div>

          <div className="mt-4 space-y-2">
            {currentQ.options.map((opt, k) => {
              const answeredCorrect = isAnswered && k === currentQ.answer;
              const answeredWrong   = isAnswered && k === picked && k !== currentQ.answer;
              const base = 'w-full text-left p-3 rounded-lg border transition';
              const state = answeredCorrect
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                : answeredWrong
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                  : picked === k
                    ? 'border-brand-500 bg-brand-500/5'
                    : 'border-ink-200 dark:border-ink-800 hover:border-ink-300 dark:hover:border-ink-600';
              return (
                <button key={k} disabled={isAnswered}
                  onClick={() => setPicked(k)}
                  className={`${base} ${state}`}>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-ink-100 dark:bg-ink-800 text-xs flex items-center justify-center font-semibold">
                      {String.fromCharCode(65 + k)}
                    </span>
                    <span className="text-sm">{opt}</span>
                    {answeredCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                    {answeredWrong && <X className="w-4 h-4 text-rose-600" />}
                  </span>
                </button>
              );
            })}
          </div>

          {isAnswered && currentQ.explanation && (
            <div className="mt-4 p-3 rounded-lg bg-ink-50 dark:bg-ink-900/50 border border-ink-200 dark:border-ink-800">
              <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide mb-1">Why</div>
              <MD className="text-sm">{currentQ.explanation}</MD>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {!isAnswered
              ? <button className="btn-primary" onClick={lock} disabled={picked === null}>Lock answer</button>
              : <button className="btn-primary" onClick={next}><ChevronRight className="w-4 h-4" />{idx + 1 >= questions.length ? 'Finish' : 'Next'}</button>
            }
            <button className="btn-ghost" onClick={restart}>Quit</button>
          </div>
        </Card>
      )}

      {/* Results */}
      {finished && (
        <Card className="max-w-xl mx-auto text-center">
          <Target className="w-10 h-10 mx-auto text-brand-500 mb-2" />
          <h2 className="text-2xl font-display font-bold">Score: {score}/{questions.length}</h2>
          <p className="text-sm text-ink-500 mt-1">{pct(score, questions.length)}% on {topic.name} · {difficulty}</p>
          <p className="text-sm mt-3 max-w-md mx-auto">{feedbackLine(score, questions.length)}</p>
          <div className="mt-5 flex justify-center gap-2">
            <button className="btn-primary" onClick={() => { restart(); start(); }}><RotateCcw className="w-4 h-4" />Retry</button>
            <button className="btn-ghost" onClick={restart}>New quiz</button>
          </div>
        </Card>
      )}
    </div>
  );
}

function pct(a, b){ return Math.round((a / (b || 1)) * 100); }
function feedbackLine(s, t){
  const p = pct(s, t);
  if (p >= 85) return "Rock-solid. Teach this to a junior — explaining seals it for good.";
  if (p >= 65) return "Good base. Now redo the wrong ones. Don't just 'know why' — solve a variant.";
  if (p >= 40) return "Half-knowledge is expensive in JEE. Revise this topic tonight + 10 fresh MCQs tomorrow.";
  return "No judgement. Go back to basics of this chapter. Prof. Arjun says: first principles, then problems.";
}

function paramFromHash(key){
  try {
    const h = location.hash || '';
    const q = h.split('?')[1] || '';
    const p = new URLSearchParams(q);
    return p.get(key);
  } catch { return null; }
}
