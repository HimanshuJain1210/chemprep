import React, { useState } from 'react';
import { Card } from '../components/UI.jsx';
import {
  User, Cpu, Cloud, Sun, Moon, Laptop,
  Download, Upload, Trash2, ShieldCheck, Info, CheckCircle2, Zap, Rocket, Server,
  Bell, BellOff
} from 'lucide-react';
import { getState, setState, replaceState, resetState, DEFAULT_STATE } from '../lib/storage.js';
import { applyTheme as setTheme, getTheme } from '../lib/theme.js';
import { requestPermissionAndEnable, disable as disableNotifications, fireTest, notificationStatus } from '../lib/notifications.js';

const IS_DEPLOYED = typeof window !== 'undefined' &&
  !['localhost', '127.0.0.1', '0.0.0.0', ''].includes(window.location.hostname);

export default function Settings(){
  const state = getState();
  const [provider, setProvider] = useState(state.settings.provider || 'groq');
  const [theme, setThemeLocal] = useState(getTheme());
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState('');

  const save = (patch) => setState(patch);

  const applyThemeLocal = (t) => {
    setThemeLocal(t);
    setTheme(t);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemprep-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Exported backup.');
  };

  const importJSON = () => {
    try {
      const parsed = JSON.parse(importText);
      replaceState(parsed);
      setMsg('Imported successfully. Refresh views to see.');
      setImportText('');
    } catch {
      setMsg('Invalid JSON.');
    }
  };

  const doReset = () => {
    if (!confirm('Wipe all local data? This cannot be undone.')) return;
    resetState();
    setMsg('All data reset.');
  };

  const providerOk =
    provider === 'groq' ? !!state.settings.groqKey :
    provider === 'openrouter' ? !!state.settings.openrouterKey :
    provider === 'gemini' ? !!state.settings.geminiKey :
    provider === 'anthropic' ? !!state.settings.anthropicKey : false;

  const setProv = (p) => {
    setProvider(p);
    save({ settings: { provider: p } });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Profile, AI provider preferences, theme, and data controls.</p>
      </header>

      {msg && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {msg}
        </div>
      )}

      {/* Profile */}
      <Card className="mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Profile</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Name</label>
            <input className="input mt-1" value={state.profile.name} onChange={e => save({ profile: { name: e.target.value } })} />
          </div>
          <div>
            <label className="label">Class</label>
            <select className="input mt-1" value={state.profile.cls} onChange={e => save({ profile: { cls: Number(e.target.value) } })}>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>
          <div>
            <label className="label">Target exam date</label>
            <input type="date" className="input mt-1" value={state.profile.targetDate || ''} onChange={e => save({ profile: { targetDate: e.target.value } })} />
          </div>
          <div>
            <label className="label">Weekly target (minutes)</label>
            <input type="number" min="60" step="30" className="input mt-1" value={state.profile.weekTargetMins} onChange={e => save({ profile: { weekTargetMins: Number(e.target.value) || 0 } })} />
          </div>
          <div>
            <label className="label">Daily screen-time cap (minutes)</label>
            <input type="number" min="0" step="15" className="input mt-1" value={state.profile.screenCapMins} onChange={e => save({ profile: { screenCapMins: Number(e.target.value) || 0 } })} />
          </div>
        </div>
      </Card>

      {/* AI Provider */}
      <Card className="mb-4">
        <h3 className="font-semibold mb-1 flex items-center gap-2"><Cpu className="w-4 h-4" /> AI provider</h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-3">
          {IS_DEPLOYED
            ? "Pick which provider you want to use for text. Image-doubt solving always goes through Gemini. Keys are managed by the server — you don't need to enter anything."
            : "Pick one text provider. Gemini is still used for image-doubt solving (vision) regardless of this pick, if its key is present."}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <ProvBtn active={provider==='groq'} onClick={()=>setProv('groq')} Icon={Zap} label="Groq" sub="Recommended" />
          <ProvBtn active={provider==='openrouter'} onClick={()=>setProv('openrouter')} Icon={Rocket} label="OpenRouter" sub="Best reasoning" />
          <ProvBtn active={provider==='gemini'} onClick={()=>setProv('gemini')} Icon={Cloud} label="Gemini" sub="Vision" />
          <ProvBtn active={provider==='anthropic'} onClick={()=>setProv('anthropic')} Icon={ShieldCheck} label="Anthropic" sub="Paid" />
        </div>

        {provider === 'groq' && (
          <div className="space-y-3">
            {!IS_DEPLOYED && (
              <div>
                <label className="label">Groq API key (local dev only)</label>
                <input type="password" className="input mt-1" placeholder="gsk_..." value={state.settings.groqKey} onChange={e => save({ settings: { groqKey: e.target.value.trim() } })} />
                <p className="text-xs text-ink-500 mt-1">Free at <a className="text-brand-600 hover:underline" href="https://console.groq.com" target="_blank" rel="noreferrer">console.groq.com</a>, no card needed. On the deployed site this is handled by the <code>GROQ_API_KEY</code> env var.</p>
              </div>
            )}
            <div>
              <label className="label">Model</label>
              <select className="input mt-1" value={state.settings.groqModel} onChange={e => save({ settings: { groqModel: e.target.value } })}>
                <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (best for JEE)</option>
                <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (fastest)</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B (long context)</option>
                <option value="gemma2-9b-it">Gemma 2 9B</option>
              </select>
            </div>
          </div>
        )}

        {provider === 'openrouter' && (
          <div className="space-y-3">
            {!IS_DEPLOYED && (
              <div>
                <label className="label">OpenRouter API key (local dev only)</label>
                <input type="password" className="input mt-1" placeholder="sk-or-..." value={state.settings.openrouterKey} onChange={e => save({ settings: { openrouterKey: e.target.value.trim() } })} />
                <p className="text-xs text-ink-500 mt-1">Free at <a className="text-brand-600 hover:underline" href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">openrouter.ai/keys</a>. On the deployed site this is handled by the <code>OPENROUTER_API_KEY</code> env var.</p>
              </div>
            )}
            <div>
              <label className="label">Model</label>
              <select className="input mt-1" value={state.settings.openrouterModel} onChange={e => save({ settings: { openrouterModel: e.target.value } })}>
                <option value="deepseek/deepseek-r1:free">DeepSeek R1 (best reasoning, free)</option>
                <option value="deepseek/deepseek-chat-v3.1:free">DeepSeek Chat V3.1 (free)</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (free)</option>
                <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash Exp (free)</option>
                <option value="qwen/qwen-2.5-72b-instruct:free">Qwen 2.5 72B (free)</option>
                <option value="nvidia/llama-3.1-nemotron-70b-instruct:free">Nemotron 70B (free)</option>
              </select>
            </div>
          </div>
        )}

        {provider === 'gemini' && (
          <div className="space-y-3">
            {!IS_DEPLOYED && (
              <div>
                <label className="label">Gemini API key (local dev only)</label>
                <input type="password" className="input mt-1" placeholder="AIza..." value={state.settings.geminiKey} onChange={e => save({ settings: { geminiKey: e.target.value.trim() } })} />
                <p className="text-xs text-ink-500 mt-1">Free at <a className="text-brand-600 hover:underline" href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">aistudio.google.com/apikey</a> (Flash: 500/day). On the deployed site this is handled by the <code>GEMINI_API_KEY</code> env var. Gemini is the only provider that can solve image doubts.</p>
              </div>
            )}
            <div>
              <label className="label">Model</label>
              <select className="input mt-1" value={state.settings.geminiModel} onChange={e => save({ settings: { geminiModel: e.target.value } })}>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (recommended)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (100/day)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>
          </div>
        )}

        {provider === 'anthropic' && (
          <div className="space-y-3">
            {!IS_DEPLOYED && (
              <div>
                <label className="label">Anthropic API key (local dev only)</label>
                <input type="password" className="input mt-1" placeholder="sk-ant-..." value={state.settings.anthropicKey} onChange={e => save({ settings: { anthropicKey: e.target.value.trim() } })} />
                <p className="text-xs text-ink-500 mt-1">Paid. Get at <a className="text-brand-600 hover:underline" href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>. On the deployed site this is handled by the <code>ANTHROPIC_API_KEY</code> env var.</p>
              </div>
            )}
            <div>
              <label className="label">Model</label>
              <select className="input mt-1" value={state.settings.anthropicModel} onChange={e => save({ settings: { anthropicModel: e.target.value } })}>
                <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (recommended)</option>
                <option value="claude-opus-4-6">Claude Opus 4.6 (highest quality)</option>
                <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (cheapest)</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs">
          {IS_DEPLOYED
            ? <span className="text-emerald-600 flex items-center gap-1"><Server className="w-3.5 h-3.5" />Keys are configured on the server — you're ready to learn.</span>
            : providerOk
              ? <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Key configured</span>
              : <span className="text-amber-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />No key yet — AI features won't work locally until you add one.</span>
          }
        </div>

        {!IS_DEPLOYED && (
          <div className="mt-5 p-3 rounded-lg bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-0.5" checked={state.settings.useProxy} onChange={e => save({ settings: { useProxy: e.target.checked } })} />
              <div>
                <div className="text-sm font-medium">Use backend proxy (local dev)</div>
                <div className="text-xs text-ink-500">If you're running the local <code>server/</code> proxy, enable this so keys stay off the browser. On Vercel this is automatic — no toggle needed.</div>
              </div>
            </label>
          </div>
        )}
      </Card>

      {/* Daily reminders */}
      <Card className="mb-4">
        <h3 className="font-semibold mb-1 flex items-center gap-2"><Bell className="w-4 h-4" /> Daily reminders</h3>
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-3">
          Two pings a day, no more. <b>2:00 PM</b> after school, and <b>9:00 PM</b> for the wind-down. Helps with consistency without becoming noise.
        </p>
        <NotificationToggle state={state} setMsg={setMsg} />
        <p className="text-[11px] text-ink-400 mt-3">
          Tip: install JEEPrep to your home screen first (browser menu → "Install" or "Add to home screen") — notifications fire much more reliably as a PWA than from a regular browser tab. On iPhone, the PWA must be added before notifications work at all.
        </p>
      </Card>

      {/* Theme */}
      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Theme</h3>
        <div className="flex gap-2">
          {[
            { id: 'light',  label: 'Light',  Icon: Sun },
            { id: 'dark',   label: 'Dark',   Icon: Moon },
            { id: 'system', label: 'System', Icon: Laptop }
          ].map(t => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => applyThemeLocal(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm ${active ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/20 dark:border-brand-700 dark:text-brand-300' : 'border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900/40'}`}
              >
                <t.Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Data controls */}
      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Data</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="btn-secondary" onClick={exportJSON}><Download className="w-4 h-4 inline -mt-0.5 mr-1" /> Export JSON</button>
          <button className="btn-danger" onClick={doReset}><Trash2 className="w-4 h-4 inline -mt-0.5 mr-1" /> Reset all data</button>
        </div>
        <div>
          <label className="label">Paste backup JSON to import</label>
          <textarea className="input mt-1 font-mono text-xs h-32" value={importText} onChange={e => setImportText(e.target.value)} placeholder='{"profile":{...},"syllabus":{...},...}' />
          <button className="btn-primary mt-2" onClick={importJSON} disabled={!importText.trim()}><Upload className="w-4 h-4 inline -mt-0.5 mr-1" /> Import</button>
        </div>
        <p className="text-xs text-ink-500 mt-3">All data is stored in your browser's <code>localStorage</code> under <code>chemprep:state:v2</code>. Nothing is sent anywhere unless you use the AI features.</p>
      </Card>
    </div>
  );
}

function NotificationToggle({ state, setMsg }){
  const enabled = !!state.notifications?.enabled;
  const status = typeof window !== 'undefined' ? notificationStatus() : 'unsupported';

  const turnOn = async () => {
    const r = await requestPermissionAndEnable();
    setMsg(r.ok ? 'Daily reminders are on. Next ping at 2:00 PM or 9:00 PM, whichever comes first.' : (r.reason || 'Could not enable notifications.'));
  };
  const turnOff = () => {
    disableNotifications();
    setMsg('Daily reminders are off. You can switch them back on anytime.');
  };
  const test = async () => {
    const r = await fireTest();
    setMsg(r.ok ? 'Sent a test reminder. Check your notification tray.' : (r.reason || 'Test failed.'));
  };

  if (status === 'unsupported'){
    return <div className="text-xs text-amber-600">Your browser doesn't support notifications.</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {enabled ? (
        <>
          <span className="chip chip-emerald"><Bell className="w-3.5 h-3.5" /> On — 2 PM &amp; 9 PM</span>
          <button className="btn-ghost" onClick={turnOff}><BellOff className="w-4 h-4" /> Turn off</button>
          <button className="btn-ghost" onClick={test}>Send a test ping</button>
        </>
      ) : (
        <>
          <button className="btn-primary" onClick={turnOn}><Bell className="w-4 h-4" /> Turn on daily reminders</button>
          {status === 'denied' && (
            <span className="text-xs text-amber-600">Notifications were blocked earlier. Re-enable them in your browser site settings, then come back.</span>
          )}
        </>
      )}
    </div>
  );
}

function ProvBtn({ active, onClick, Icon, label, sub }){
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-left text-sm ${active ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-900/20 dark:border-brand-700 dark:text-brand-300' : 'border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900/40'}`}
    >
      <div className="flex items-center gap-1.5 font-medium"><Icon className="w-4 h-4" /> {label}</div>
      <div className="text-xs opacity-70 mt-0.5">{sub}</div>
    </button>
  );
}
