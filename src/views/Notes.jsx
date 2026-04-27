import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StickyNote, Plus, Trash2, Search, Tag, BookOpen, FlaskConical, Atom,
  Hexagon, Save, Clock, Pin, PinOff, ChevronDown, X, Filter
} from 'lucide-react';
import { Card, SectionTitle, Modal, useToast, Empty } from '../components/UI.jsx';
import { getState, setState } from '../lib/storage.js';
import { SYLLABUS } from '../data/syllabus.js';

// ── Subject meta ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: 'all',       label: 'All',      icon: BookOpen,    cls: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200' },
  { id: 'chemistry', label: 'Chemistry',icon: FlaskConical, cls: 'bg-brand-500/15 text-brand-700 dark:text-brand-300' },
  { id: 'physics',   label: 'Physics',  icon: Atom,        cls: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
  { id: 'maths',     label: 'Maths',    icon: Hexagon,     cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
];

const SUBJECT_DOT = {
  chemistry: 'bg-brand-500',
  physics:   'bg-violet-500',
  maths:     'bg-amber-500',
};

function makeId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function fmtDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

// ── Tiny rich-ish textarea editor ────────────────────────────────────────────
function NoteEditor({ note, onChange, onSave, saving }) {
  const ta = useRef(null);

  // auto-resize
  useEffect(() => {
    if (ta.current) {
      ta.current.style.height = 'auto';
      ta.current.style.height = ta.current.scrollHeight + 'px';
    }
  }, [note.content]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <input
        className="input text-lg font-semibold font-display"
        placeholder="Note title…"
        value={note.title}
        onChange={e => onChange({ ...note, title: e.target.value })}
      />
      <textarea
        ref={ta}
        className="input resize-none flex-1 font-mono text-sm leading-relaxed min-h-[260px]"
        placeholder={`Write your notes here…\n\nMarkdown-like tips:\n• Use ==highlight== for key terms\n• Use ## for headings\n• Use - for bullet lists`}
        value={note.content}
        onChange={e => onChange({ ...note, content: e.target.value })}
      />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Tags */}
        <TagInput tags={note.tags || []} onChange={tags => onChange({ ...note, tags })} />
        <button
          className="btn-primary gap-2"
          onClick={onSave}
          disabled={saving}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save note'}
        </button>
      </div>
    </div>
  );
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const t = input.trim().toLowerCase();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Tag className="w-3.5 h-3.5 text-ink-400" />
      {tags.map(t => (
        <span key={t} className="chip chip-ink text-xs gap-1">
          {t}
          <button onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-red-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        className="input py-0.5 px-2 text-xs w-24"
        placeholder="+ tag"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
      />
    </div>
  );
}

// ── Render note content with basic markdown-ish styling ──────────────────────
function NoteContent({ content }) {
  const lines = (content || '').split('\n');
  return (
    <div className="text-sm leading-relaxed space-y-1 font-mono">
      {lines.map((line, i) => {
        if (line.startsWith('## '))
          return <p key={i} className="font-semibold text-base font-display">{line.slice(3)}</p>;
        if (line.startsWith('# '))
          return <p key={i} className="font-bold text-lg font-display">{line.slice(2)}</p>;
        if (line.startsWith('- ') || line.startsWith('• '))
          return <p key={i} className="pl-3 before:content-['•'] before:mr-2 before:text-brand-500">{line.slice(2)}</p>;
        // highlight ==term==
        const parts = line.split(/(==.+?==)/g);
        return (
          <p key={i}>
            {parts.map((p, j) =>
              p.startsWith('==') && p.endsWith('==')
                ? <mark key={j} className="bg-amber-200 dark:bg-amber-800/50 text-amber-900 dark:text-amber-200 px-0.5 rounded">{p.slice(2, -2)}</mark>
                : <span key={j}>{p}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// ── Main Notes view ──────────────────────────────────────────────────────────
export default function Notes({ go, state }) {
  const toast = useToast();

  // notes stored in state.notes (array)
  const notes = state.notes || [];

  const [subject, setSubject] = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null); // note being edited/viewed
  const [editDraft, setEditDraft] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', subject: 'chemistry', topicId: '', content: '', tags: [] });
  const [deleteId, setDeleteId] = useState(null);

  // filter notes
  const filtered = notes
    .filter(n => subject === 'all' || n.subject === subject)
    .filter(n => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        (n.tags || []).some(t => t.includes(q))
      );
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const openNote = (note) => {
    setSelected(note);
    setEditDraft({ ...note });
  };

  const saveEdit = () => {
    if (!editDraft) return;
    setSaving(true);
    const updated = notes.map(n =>
      n.id === editDraft.id ? { ...editDraft, updatedAt: new Date().toISOString() } : n
    );
    setState({ notes: updated });
    setSelected({ ...editDraft, updatedAt: new Date().toISOString() });
    setSaving(false);
    toast.push('Note saved', 'success');
  };

  const createNote = () => {
    if (!newNote.title.trim()) { toast.push('Add a title first', 'error'); return; }
    const note = {
      id: makeId(),
      ...newNote,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setState({ notes: [note, ...notes] });
    setCreateOpen(false);
    setNewNote({ title: '', subject: 'chemistry', topicId: '', content: '', tags: [] });
    toast.push('Note created', 'success');
    // open it immediately
    setSelected(note);
    setEditDraft({ ...note });
  };

  const deleteNote = (id) => {
    setState({ notes: notes.filter(n => n.id !== id) });
    if (selected?.id === id) { setSelected(null); setEditDraft(null); }
    setDeleteId(null);
    toast.push('Note deleted', 'info');
  };

  const togglePin = (id) => {
    setState({ notes: notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n) });
  };

  // Topics for selected subject in create modal
  const subjectTopics = SYLLABUS.filter(t =>
    newNote.subject === 'chemistry'
      ? true // existing chemistry syllabus
      : t.subject === newNote.subject
  );

  return (
    <div>
      <SectionTitle
        title="Notes"
        subtitle="Save key concepts, formulas, tricks — tagged by subject and chapter."
        actions={
          <button className="btn-primary" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" /> New note
          </button>
        }
      />

      {/* Subject filter + search */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {SUBJECTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSubject(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
              ${subject === s.id ? s.cls + ' border-current' : 'border-transparent text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800'}`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-8 w-56 py-1.5 text-sm"
            placeholder="Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Layout: list + editor */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 items-start">
        {/* Notes list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <Empty
              icon={StickyNote}
              title="No notes yet"
              desc={search ? 'No notes match your search.' : 'Hit "+ New note" to start capturing ideas.'}
            />
          )}
          {filtered.map(note => (
            <div
              key={note.id}
              onClick={() => openNote(note)}
              className={`group relative rounded-xl border p-3.5 cursor-pointer transition-all
                ${selected?.id === note.id
                  ? 'border-brand-500 bg-brand-500/5'
                  : 'border-ink-200 dark:border-ink-700 hover:border-brand-400 hover:bg-ink-50 dark:hover:bg-ink-800/50'}`}
            >
              <div className="flex items-start gap-2">
                {/* subject dot */}
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${SUBJECT_DOT[note.subject] || 'bg-ink-400'}`} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm truncate">{note.title || 'Untitled'}</div>
                  <div className="text-xs text-ink-500 mt-0.5 line-clamp-2">
                    {note.content?.slice(0, 90) || 'No content'}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {(note.tags || []).slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300 px-1.5 py-0.5 rounded-md">{t}</span>
                    ))}
                    <span className="text-[10px] text-ink-400 ml-auto flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {fmtDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* pin + delete actions */}
              <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1">
                <button
                  onClick={e => { e.stopPropagation(); togglePin(note.id); }}
                  className="p-1 rounded-lg hover:bg-ink-200 dark:hover:bg-ink-700"
                  title={note.pinned ? 'Unpin' : 'Pin'}
                >
                  {note.pinned
                    ? <PinOff className="w-3.5 h-3.5 text-brand-500" />
                    : <Pin className="w-3.5 h-3.5 text-ink-400" />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setDeleteId(note.id); }}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              {note.pinned && (
                <span className="absolute top-2 right-2 group-hover:hidden">
                  <Pin className="w-3 h-3 text-brand-400" />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Editor panel */}
        {selected && editDraft ? (
          <Card className="sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2.5 h-2.5 rounded-full ${SUBJECT_DOT[selected.subject] || 'bg-ink-400'}`} />
              <span className="text-xs text-ink-500 capitalize">{selected.subject}</span>
              {selected.topicId && (
                <>
                  <span className="text-ink-300 dark:text-ink-600">·</span>
                  <span className="text-xs text-ink-500">{SYLLABUS.find(t => t.id === selected.topicId)?.name || selected.topicId}</span>
                </>
              )}
              <span className="ml-auto text-xs text-ink-400">{fmtDate(selected.updatedAt)}</span>
            </div>
            <NoteEditor
              note={editDraft}
              onChange={setEditDraft}
              onSave={saveEdit}
              saving={saving}
            />
          </Card>
        ) : (
          <Card className="sticky top-24 flex flex-col items-center justify-center py-16 text-center">
            <StickyNote className="w-10 h-10 text-ink-300 mb-3" />
            <p className="text-ink-500 text-sm">Select a note to read or edit it</p>
            <p className="text-ink-400 text-xs mt-1">or create a new one above</p>
          </Card>
        )}
      </div>

      {/* Create note modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New note"
        size="md"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={createNote}><Plus className="w-4 h-4" />Create</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">Title</label>
            <input
              className="input mt-1"
              placeholder="e.g. Nernst Equation tricks"
              value={newNote.title}
              onChange={e => setNewNote({ ...newNote, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Subject</label>
              <select className="input mt-1" value={newNote.subject} onChange={e => setNewNote({ ...newNote, subject: e.target.value, topicId: '' })}>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
                <option value="maths">Maths</option>
              </select>
            </div>
            <div>
              <label className="label">Topic (optional)</label>
              <select className="input mt-1" value={newNote.topicId} onChange={e => setNewNote({ ...newNote, topicId: e.target.value })}>
                <option value="">— none —</option>
                {SYLLABUS
                  .filter(t => newNote.subject === 'chemistry' || t.subject === newNote.subject)
                  .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                }
              </select>
            </div>
          </div>
          <div>
            <label className="label">Content</label>
            <textarea
              className="input mt-1 font-mono text-sm min-h-[120px] resize-none"
              placeholder="Your note content…"
              value={newNote.content}
              onChange={e => setNewNote({ ...newNote, content: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Tags</label>
            <TagInput tags={newNote.tags} onChange={tags => setNewNote({ ...newNote, tags })} />
          </div>
        </div>
      </Modal>

      {/* Confirm delete modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete note?"
        size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => deleteNote(deleteId)}>
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-400">
          This note will be permanently deleted. This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
