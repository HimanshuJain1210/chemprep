import React, { useEffect, useRef, useState } from 'react';
import { Card, SectionTitle, MD, useToast, useEnterKey } from '../components/UI.jsx';
import { setState } from '../lib/storage.js';
import { chat, solveImageDoubt } from '../lib/ai.js';
import { topicsFor, topicById } from '../data/syllabus.js';
import { Sparkles, Send, ImagePlus, User, Bot, X, Trash2 } from 'lucide-react';

export default function Tutor({ state }){
  const subject = state.profile && state.profile.subject ? state.profile.subject : "chemistry";
  const SYLLABUS = topicsFor(subject);
  const toast = useToast();
  const [text, setText] = useState('');
  const [topicId, setTopicId] = useState(() => paramFromHash('topic') || '');
  const [image, setImage] = useState(null); // { base64, mime, preview }
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEnterKey(inputRef, () => !loading && send());

  useEffect(() => {
    const hashTopic = paramFromHash('topic');
    if (hashTopic) setTopicId(hashTopic);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.chat, loading]);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024){
      toast.push('Image too large (max 4 MB)', 'warn');
      return;
    }
    const b64 = await fileToBase64(file);
    setImage({ base64: b64, mime: file.type || 'image/png', preview: URL.createObjectURL(file) });
  };

  const send = async () => {
    const content = text.trim();
    if (!content && !image) return;
    const topic = topicId ? topicById(topicId) : null;
    const userMsg = { role: 'user', content: content || 'Please solve this problem.', image: image?.preview };
    setState(s => ({ chat: [...s.chat, userMsg] }));
    setText('');
    setLoading(true);

    try {
      let reply;
      if (image){
        reply = await solveImageDoubt(image.base64, image.mime, content ? `Context: ${content}` : '');
      } else {
        reply = await chat(content, { topic });
      }
      setState(s => ({ chat: [...s.chat, { role: 'assistant', content: reply }] }));
    } catch (e){
      toast.push(e.message || 'Tutor failed', 'error');
      setState(s => ({ chat: [...s.chat, { role: 'assistant', content: `⚠️ ${e.message || 'Something went wrong. Check your API key in Settings.'}` }] }));
    } finally {
      setLoading(false);
      setImage(null);
    }
  };

  const clearChat = () => {
    if (!confirm('Clear chat history?')) return;
    setState({ chat: [] });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <SectionTitle
        title="AI tutor"
        subtitle="Ask a doubt, paste a problem photo, or just vent about your week. No judgement."
        actions={
          state.chat.length > 0 && <button className="btn-ghost" onClick={clearChat}><Trash2 className="w-4 h-4" />Clear</button>
        }
      />

      {/* Topic context selector */}
      <Card className="mb-3">
        <label className="label">Context topic (optional — helps the tutor focus)</label>
        <select className="input mt-1" value={topicId} onChange={e => setTopicId(e.target.value)}>
          <option value="">— none —</option>
          {SYLLABUS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </Card>

      {/* Chat scroll */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-1">
        {state.chat.length === 0 && (
          <WelcomeChat />
        )}
        {state.chat.map((m, i) => <Bubble key={i} m={m} />)}
        {loading && <Bubble m={{ role: 'assistant', content: '…thinking' }} />}
      </div>

      {/* Composer */}
      <div className="pt-3">
        {image && (
          <div className="mb-2 inline-flex items-center gap-2 p-2 rounded-lg border border-ink-200 dark:border-ink-800">
            <img src={image.preview} className="w-10 h-10 rounded object-cover" />
            <span className="text-xs">Image attached</span>
            <button onClick={() => setImage(null)} className="p-1 rounded hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="btn-ghost cursor-pointer" title="Attach photo of a problem">
            <ImagePlus className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
          <textarea
            ref={inputRef}
            className="input flex-1 resize-none"
            rows="2"
            placeholder="Ask anything — e.g. 'Explain CFSE for [Fe(CN)₆]³⁻' or upload a problem image."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="btn-primary" onClick={send} disabled={loading}>
            {loading ? '…' : <><Send className="w-4 h-4" />Send</>}
          </button>
        </div>
        <div className="text-[11px] text-ink-500 mt-1">Enter to send · Shift+Enter for newline · Images require Gemini provider</div>
      </div>
    </div>
  );
}

function Bubble({ m }){
  const isUser = m.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-600 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div className={`max-w-[85%] p-3 rounded-2xl ${
        isUser
          ? 'bg-brand-500 text-white rounded-br-sm'
          : 'bg-ink-100 dark:bg-ink-800 rounded-bl-sm'
      }`}>
        {m.image && <img src={m.image} className="mb-2 rounded-lg max-h-60 object-contain" />}
        {isUser
          ? <div className="whitespace-pre-wrap text-sm">{m.content}</div>
          : <MD className="text-sm">{m.content}</MD>}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-ink-200 dark:bg-ink-800 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

function WelcomeChat(){
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-brand-500" />
        <h3 className="font-semibold">Welcome.</h3>
      </div>
      <p className="text-sm text-ink-600 dark:text-ink-300">
        Your JEE chemistry tutor here. Start with one of these or ask your own:
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        <li className="p-2 rounded-lg bg-ink-50 dark:bg-ink-900/40">"Why does Markovnikov fail with HBr + peroxides?"</li>
        <li className="p-2 rounded-lg bg-ink-50 dark:bg-ink-900/40">"Compare SN1 and SN2 — with a trap question."</li>
        <li className="p-2 rounded-lg bg-ink-50 dark:bg-ink-900/40">"I have 3 weeks left and haven't done electrochem. What's the smallest viable plan?"</li>
        <li className="p-2 rounded-lg bg-ink-50 dark:bg-ink-900/40">Attach a photo of a problem — I'll read it and solve.</li>
      </ul>
    </Card>
  );
}

function fileToBase64(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || '');
      const i = s.indexOf(',');
      res(i >= 0 ? s.slice(i + 1) : s);
    };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function paramFromHash(key){
  try {
    const h = location.hash || '';
    const q = h.split('?')[1] || '';
    const p = new URLSearchParams(q);
    return p.get(key);
  } catch { return null; }
}
