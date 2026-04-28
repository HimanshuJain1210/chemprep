import React, { useState } from 'react';
import { Card, SectionTitle, Modal, Empty, useToast } from '../components/UI.jsx';
import { setState } from '../lib/storage.js';
import { Users, Plus, Copy, UserPlus, Trophy, Trash2, Share2 } from 'lucide-react';

export default function Groups({ state }){
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const myName = state.profile.name || 'Student';

  const createGroup = () => {
    if (!name.trim()) return toast.push('Give it a name first', 'warn');
    const g = {
      id: Math.random().toString(36).slice(2, 9),
      name: name.trim(),
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      members: [{ name: myName, minsThisWeek: 0 }]
    };
    setState(s => ({ groups: [...s.groups, g] }));
    setName('');
    setCreateOpen(false);
    toast.push(`Group "${g.name}" created. Share the code ${g.code}.`, 'success');
  };

  const joinGroup = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    // Local-only: groups are local demo groups. In real usage this would call a backend.
    // We simulate by adding a group placeholder using the code.
    const g = {
      id: Math.random().toString(36).slice(2, 9),
      name: `Group ${code}`,
      code,
      members: [{ name: myName, minsThisWeek: 0 }, { name: 'Peer A', minsThisWeek: 340 }, { name: 'Peer B', minsThisWeek: 210 }]
    };
    setState(s => ({ groups: [...s.groups, g] }));
    setJoinCode('');
    setJoinOpen(false);
    toast.push(`Joined ${g.name}. Remember: competition, not comparison.`, 'success');
  };

  const removeGroup = (id) => {
    if (!confirm('Leave this group?')) return;
    setState(s => ({ groups: s.groups.filter(g => g.id !== id) }));
    toast.push('Left group', 'info');
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).then(() => toast.push('Code copied', 'success'));
  };

  return (
    <div>
      <SectionTitle
        title="Study groups"
        subtitle="Peer accountability. You study longer when someone is watching — even if they're not."
        actions={
          <>
            <button className="btn-secondary" onClick={() => setJoinOpen(true)}><UserPlus className="w-4 h-4" />Join</button>
            <button className="btn-primary" onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" />Create</button>
          </>
        }
      />

      {state.groups.length === 0 && (
        <Empty
          icon="👥"
          title="No groups yet"
          hint="Create one for your class cohort or join a friend's with their code."
          action={<button className="btn-primary" onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" />Create a group</button>}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {state.groups.map(g => {
          const ranked = [...(g.members || [])].sort((a, b) => (b.minsThisWeek || 0) - (a.minsThisWeek || 0));
          return (
            <Card key={g.id}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-500" />
                    <h3 className="font-semibold">{g.name}</h3>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                    <span>Code:</span>
                    <code className="font-mono bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">{g.code}</code>
                    <button className="btn-ghost text-xs p-1" onClick={() => copyCode(g.code)}><Copy className="w-3 h-3" /></button>
                  </div>
                </div>
                <button className="btn-ghost text-xs p-1.5" onClick={() => removeGroup(g.id)} title="Leave">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>

              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />Weekly leaderboard
              </h4>
              <div className="space-y-1.5">
                {ranked.map((m, k) => (
                  <div key={k} className={`flex items-center justify-between p-2 rounded-lg ${
                    m.name === myName ? 'bg-brand-500/10 border border-brand-500/30' : 'bg-ink-50 dark:bg-ink-900/40'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-500 w-5">#{k + 1}</span>
                      <span className="text-sm font-medium">{m.name}{m.name === myName && ' (you)'}</span>
                    </div>
                    <span className="text-xs text-ink-500">{m.minsThisWeek || 0} min</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-ink-500 mt-3 italic">
                Mentor tip: if you're at the top — share a weak-area trick with the group. Teaching is the best revision.
              </p>
            </Card>
          );
        })}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create group" size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={createGroup}><Share2 className="w-4 h-4" />Create</button>
          </>
        }>
        <label className="label">Group name</label>
        <input className="input mt-1" placeholder="e.g. 12-A JEE Crew" value={name} onChange={e => setName(e.target.value)} />
        <p className="text-xs text-ink-500 mt-3">A shareable code will be generated. Your peers paste it into "Join".</p>
      </Modal>

      {/* Join modal */}
      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join group" size="sm"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setJoinOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={joinGroup}><UserPlus className="w-4 h-4" />Join</button>
          </>
        }>
        <label className="label">Invite code</label>
        <input className="input mt-1 font-mono uppercase" placeholder="ABC123" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
        <p className="text-xs text-ink-500 mt-3">Note: this demo uses local-only groups. A future build syncs members in real time.</p>
      </Modal>
    </div>
  );
}
