import React, { useState } from 'react';
import { Modal } from './UI.jsx';
import { setState } from '../lib/storage.js';
import { MENTOR_WELCOME } from '../data/formulas.js';

const IS_DEPLOYED = typeof window !== 'undefined' &&
  !['localhost', '127.0.0.1', '0.0.0.0', ''].includes(window.location.hostname);

export default function Onboarding({ onDone }){
  const [name, setName] = useState('');
  const [cls, setCls] = useState(12);
  const [target, setTarget] = useState('');

  const finish = () => {
    setState({
      profile: {
        name: name.trim() || 'Student',
        cls: Number(cls),
        targetDate: target || ''
      }
    });
    onDone?.();
  };

  const msg = MENTOR_WELCOME[Math.floor(Math.random() * MENTOR_WELCOME.length)];

  return (
    <Modal open={true} onClose={() => {}} title="Welcome to ChemPrep" size="md">
      <p className="text-sm text-ink-600 dark:text-ink-300 italic mb-4">"{msg}"</p>

      <label className="label">Your name</label>
      <input className="input mt-1" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="First name is fine" />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label className="label">Class</label>
          <select className="input mt-1" value={cls} onChange={e => setCls(e.target.value)}>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
        <div>
          <label className="label">Target exam date</label>
          <input type="date" className="input mt-1" value={target} onChange={e => setTarget(e.target.value)} />
        </div>
      </div>

      {IS_DEPLOYED ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-4">
          <b>You're all set.</b> AI is already configured on the server — just hit "Start preparing" and pick your first chapter from Syllabus.
        </p>
      ) : (
        <p className="text-xs text-ink-500 dark:text-ink-400 mt-4">
          <b>Local dev tip:</b> open Settings and paste a free <b>Groq</b> key (fastest + generous free tier — 30 seconds at <code>console.groq.com</code>, no credit card). On Vercel this is handled by env vars instead.
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <button className="btn-primary" onClick={finish}>Start preparing</button>
      </div>
    </Modal>
  );
}
