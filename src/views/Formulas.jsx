import React, { useMemo, useState } from 'react';
import { Card, SectionTitle, Empty } from '../components/UI.jsx';
import { topicsFor, branchesFor } from '../data/syllabus.js';
import { FORMULAS, PYQS } from '../data/formulas.js';
import { Search, FlaskConical, BookMarked } from 'lucide-react';

export default function Formulas({ state }){
  const subject = state.profile && state.profile.subject ? state.profile.subject : "chemistry";
  const SYLLABUS = topicsFor(subject);
  const BRANCHES = branchesFor(subject);
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');
  const [openId, setOpenId] = useState(null);

  const topics = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SYLLABUS.filter(t => {
      if (branch !== 'all' && t.branch !== branch) return false;
      if (!needle) return true;
      const hay = (t.name + ' ' + (FORMULAS[t.id]?.formulas || []).map(f => f.f + f.note).join(' ')).toLowerCase();
      return hay.includes(needle);
    });
  }, [q, branch]);

  const topicsWithContent = topics.filter(t => FORMULAS[t.id] || PYQS[t.id]);
  const open = openId ? SYLLABUS.find(t => t.id === openId) : null;
  const openFormulas = open ? FORMULAS[open.id] : null;
  const openPyqs = open ? PYQS[open.id] : null;

  return (
    <div>
      <SectionTitle
        title="Formula sheet + PYQs"
        subtitle="Curated formulas and previous-year-style questions. Glance daily — your 5-minute formula flash is here."
      />

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Search formulas or topics…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="input w-auto" value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="all">All branches</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {topicsWithContent.map(t => {
          const f = FORMULAS[t.id];
          const p = PYQS[t.id];
          return (
            <button key={t.id}
              onClick={() => setOpenId(openId === t.id ? null : t.id)}
              className={`card p-4 text-left hover:shadow-md transition ${openId === t.id ? 'ring-2 ring-brand-500' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="w-4 h-4 text-brand-500" />
                <span className="text-[10px] uppercase tracking-wide text-ink-500">{t.branch} · class {t.cls}</span>
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <div className="flex gap-4 mt-2 text-xs text-ink-500">
                {f?.formulas && <span>{f.formulas.length} formula{f.formulas.length === 1 ? '' : 's'}</span>}
                {p?.length && <span>· {p.length} PYQ{p.length === 1 ? '' : 's'}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {topicsWithContent.length === 0 && (
        <Empty icon="📄" title="No matches" hint="Try a different keyword." />
      )}

      {/* Detail panel */}
      {open && (
        <Card className="sticky top-24">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold">{open.name}</h2>
              <p className="text-xs text-ink-500 capitalize">{open.branch} · Class {open.cls} · Weight {open.weight}</p>
            </div>
            <button className="btn-ghost text-xs" onClick={() => setOpenId(null)}>Close</button>
          </div>

          {openFormulas?.formulas?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-1"><FlaskConical className="w-4 h-4" />Formulas</h3>
              <div className="space-y-2">
                {openFormulas.formulas.map((f, k) => (
                  <div key={k} className="p-2.5 rounded-lg bg-ink-50 dark:bg-ink-900/50 border border-ink-200 dark:border-ink-800">
                    <code className="text-sm font-mono break-words">{f.f}</code>
                    {f.note && <div className="text-[11px] text-ink-500 mt-0.5">{f.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {openPyqs && openPyqs.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-1"><BookMarked className="w-4 h-4" />Previous-year style</h3>
              <div className="space-y-2">
                {openPyqs.map((p, k) => (
                  <div key={k} className="p-3 rounded-lg border border-ink-200 dark:border-ink-800">
                    <div className="text-[11px] text-ink-500 mb-1">{p.year} · {p.exam}</div>
                    <div className="text-sm">{p.q}</div>
                    <details className="mt-2">
                      <summary className="text-xs text-brand-600 cursor-pointer hover:underline">Show answer</summary>
                      <div className="text-xs mt-1 text-ink-700 dark:text-ink-200">{p.ans}</div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}

          {open.traps && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Trap: </span>{open.traps}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
