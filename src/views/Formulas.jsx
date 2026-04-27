import React, { useMemo, useState } from 'react';
import { Card, SectionTitle, Empty, Modal } from '../components/UI.jsx';
import { SYLLABUS, BRANCHES } from '../data/syllabus.js';
import { FORMULAS, PYQS } from '../data/formulas.js';
import { Search, FlaskConical, BookMarked, Lock } from 'lucide-react';

export default function Formulas(){
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');
  const [openId, setOpenId] = useState(null);

  // Show ALL topics — not just those with formula data
  const topics = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SYLLABUS.filter(t => {
      if (branch !== 'all' && t.branch !== branch) return false;
      if (!needle) return true;
      const hay = (t.name + ' ' + (FORMULAS[t.id]?.formulas || []).map(f => f.f + f.note).join(' ')).toLowerCase();
      return hay.includes(needle);
    });
  }, [q, branch]);

  const open = openId ? SYLLABUS.find(t => t.id === openId) : null;
  const openFormulas = open ? FORMULAS[open.id] : null;
  const openPyqs = open ? PYQS?.[open.id] : null;
  const hasContent = open && (openFormulas || openPyqs?.length);

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
            <input
              className="input pl-9"
              placeholder="Search formulas or topics…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <select className="input w-auto" value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="all">All branches</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </Card>

      {/* Grid — all chapters always visible */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map(t => {
          const f = FORMULAS[t.id];
          const p = PYQS?.[t.id];
          const hasData = !!(f || p?.length);
          return (
            <button
              key={t.id}
              onClick={() => setOpenId(t.id)}
              className={`card p-4 text-left hover:shadow-md transition-all ${!hasData ? 'opacity-60' : 'hover:ring-2 hover:ring-brand-400'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {hasData
                  ? <FlaskConical className="w-4 h-4 text-brand-500 shrink-0" />
                  : <Lock className="w-4 h-4 text-ink-400 shrink-0" />
                }
                <span className="text-[10px] uppercase tracking-wide text-ink-500">{t.branch} · class {t.cls}</span>
              </div>
              <h3 className="font-semibold text-sm">{t.name}</h3>
              <div className="flex gap-4 mt-2 text-xs text-ink-500">
                {f?.formulas?.length
                  ? <span>{f.formulas.length} formula{f.formulas.length === 1 ? '' : 's'}</span>
                  : null
                }
                {p?.length
                  ? <span>· {p.length} PYQ{p.length === 1 ? '' : 's'}</span>
                  : null
                }
                {!hasData && <span className="text-ink-400 italic">Coming soon</span>}
              </div>
            </button>
          );
        })}
      </div>

      {topics.length === 0 && (
        <Empty icon="📄" title="No matches" hint="Try a different keyword." />
      )}

      {/* Modal detail panel — no sticky overlap, fully clickable grid stays intact */}
      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.name}
        size="lg"
      >
        {open && (
          <>
            <p className="text-xs text-ink-500 capitalize mb-4">
              {open.branch} · Class {open.cls} · Weight {open.weight}
            </p>

            {!hasContent && (
              <div className="py-8 text-center text-ink-400">
                <Lock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Formulas for this chapter are being added.</p>
                <p className="text-xs mt-1">Check back soon.</p>
              </div>
            )}

            {openFormulas?.formulas?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <FlaskConical className="w-4 h-4" /> Formulas
                </h3>
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

            {openPyqs?.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <BookMarked className="w-4 h-4" /> Previous-year style
                </h3>
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
          </>
        )}
      </Modal>
    </div>
  );
}
