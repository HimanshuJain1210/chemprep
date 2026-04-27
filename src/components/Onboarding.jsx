import React, { useState } from 'react';
import { Modal } from './UI.jsx';
import { setState } from '../lib/storage.js';
import { MENTOR_WELCOME } from '../data/formulas.js';

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
      <p className="text-sm text-ink-600 dark:text-ink-300 italic mb-4">"{msg}"<br/><span className="not-italic text-xs text-ink-400">— Prof. Arjun, your mentor</span></p>

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

      <p className="text-xs text-ink-500 dark:text-ink-400 mt-4">
        <b>Next step:</b> open Settings and paste a free <b>Groq</b> API key (recommended — fastest + generous free tier). Takes 30 seconds at <code>console.groq.com</code>, no credit card. For image-doubt solving, add a Gemini key too (vision-only feature).
      </p>

      <div className="mt-5 flex justify-end">
        <button className="btn-primary" onClick={finish}>Start preparing</button>
      </div>
    </Modal>
  );
}
