import React, { useMemo, useState, useEffect } from 'react';
import { Card, SectionTitle, Modal, useToast, Empty } from '../components/UI.jsx';
import { setState, todayISO } from '../lib/storage.js';
import { topicsFor, topicById, subjectName } from '../data/syllabus.js';
import { Plus, Search, Save, Trash2, StickyNote, Tag, X } from 'lucide-react';

const newId = () => Math.random().toString(36).slice(2, 10);

export default function Notes({ state }){
  const toast = useToast();
  const subject = state.profile?.subject || 'chemistry';
  const allNotes = state.notes || [];
  const [scope, setScope] = useState('subject'); // 'subject' | 'all'
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // null | note object

  // Sort newest first; filter
  const filtered = useMemo(() => {
    let list = [...allNotes];
    if (scope === 'subject') list = list.filter(n => n.subject === subject);
    if (query.trim()){
      const q = query.toLowerCase();
      list = list.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.body || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));
    return list;
  }, [allNotes, subject, scope, query]);

  const startNew = () => {
    setEditing({
      id: newId(),
      title: '',
      body: '',
      subject,
      topicId: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      isNew: true
    });
  };

  const saveEditing = () => {
    if (!editing) return;
    if (!editing.title.trim() && !editing.body.trim()){
      toast.push('Empty note — nothing to save.', 'info');
      setEditing(null);
      return;
    }
    const note = {
      id: editing.id,
      title: editing.title.trim() || 'Untitled note',
      body: editing.body.trim(),
      subject: editing.subject || subject,
      topicId: editing.topicId || '',
      created: editing.created || new Date().toISOString(),
      updated: new Date().toISOString()
    };
    const others = allNotes.filter(n => n.id !== note.id);
    setState({ notes: [...others, note] });
    setEditing(null);
    toast.push(editing.isNew ? 'Note saved.' : 'Note updated.', 'success');
  };

  const remove = (id) => {
    if (!confirm('Delete this note? Cannot be undone.')) return;
    setState({ notes: allNotes.filter(n => n.id !== id) });
    toast.push('Deleted.', 'info');
  };

  const counts = {
    chemistry: allNotes.filter(n => n.subject === 'chemistry').length,
    physics:   allNotes.filter(n => n.subject === 'physics').length,
    maths:     allNotes.filter(n => n.subject === 'maths').length
  };

  return (
    <div>
      <SectionTitle
        title="Notes"
        subtitle={`Quick capture — doubts, tricks, connections you'll regret losing. Currently in ${subjectName(subject)}.`}
        actions={
          <>
            <button className="btn-primary" onClick={startNew}>
              <Plus className="w-4 h-4" /> New note
            </button>
          </>
        }
      />

      {/* Search + scope */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search title or body…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setScope('subject')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                scope === 'subject'
                  ? 'bg-brand-500 text-white'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
              }`}
            >
              {subjectName(subject)} ({counts[subject] || 0})
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                scope === 'all'
                  ? 'bg-brand-500 text-white'
                  : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
              }`}
            >
              All ({allNotes.length})
            </button>
          </div>
        </div>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Empty
          icon="📝"
          title={query ? 'No matches' : 'No notes here yet'}
          hint={
            query
              ? 'Try a different search, or switch scope to "All".'
              : 'Capture one trick, one doubt, or one weak link from today\'s study. The 60 seconds it takes will save you 30 minutes of re-discovery before the exam.'
          }
          action={!query && (
            <button className="btn-primary" onClick={startNew}>
              <Plus className="w-4 h-4" /> Write your first note
            </button>
          )}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(n => {
            const topic = n.topicId ? topicById(n.topicId) : null;
            return (
              <Card key={n.id} className="cursor-pointer hover:border-brand-400 transition group" onClick={() => setEditing({ ...n })}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight flex-1 line-clamp-2">{n.title || 'Untitled'}</h3>
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500"
                    onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-ink-600 dark:text-ink-300 line-clamp-4 whitespace-pre-wrap">{n.body || '—'}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px]">
                  <span className="chip chip-brand">{subjectName(n.subject)}</span>
                  {topic && <span className="chip"><Tag className="w-3 h-3" />{topic.name}</span>}
                  <span className="ml-auto text-ink-400">{relativeTime(n.updated)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.isNew ? 'New note' : 'Edit note'}
        size="md"
        footer={
          <>
            {!editing?.isNew && (
              <button className="btn-danger mr-auto" onClick={() => { remove(editing.id); setEditing(null); }}>
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn-primary" onClick={saveEditing}>
              <Save className="w-4 h-4" /> Save
            </button>
          </>
        }
      >
        {editing && (
          <div className="space-y-3">
            <div>
              <label className="label">Title</label>
              <input
                className="input mt-1"
                autoFocus
                placeholder="e.g. SN1 vs SN2 — solvent rule"
                value={editing.title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Body</label>
              <textarea
                className="input mt-1 min-h-[180px] font-mono text-sm"
                placeholder="Write the note. Markdown ok. Capture WHY, not just WHAT — your future self needs the reasoning, not the answer."
                value={editing.body}
                onChange={e => setEditing({ ...editing, body: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Subject</label>
                <select className="input mt-1" value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value, topicId: '' })}>
                  <option value="chemistry">Chemistry</option>
                  <option value="physics">Physics</option>
                  <option value="maths">Mathematics</option>
                </select>
              </div>
              <div>
                <label className="label">Topic (optional)</label>
                <select className="input mt-1" value={editing.topicId} onChange={e => setEditing({ ...editing, topicId: e.target.value })}>
                  <option value="">— none —</option>
                  {topicsFor(editing.subject).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function relativeTime(iso){
  if (!iso) return '';
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
