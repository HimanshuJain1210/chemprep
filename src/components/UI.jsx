import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

/* ---------------- Toast ---------------- */
const ToastCtx = createContext({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = 'info', ttl = 3200) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ttl);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[90] space-y-2 pointer-events-none">
        {toasts.map(t => <Toast key={t.id} {...t} />)}
      </div>
    </ToastCtx.Provider>
  );
}

function Toast({ msg, kind }){
  const icons = {
    info:    <Info className="w-4 h-4" />,
    success: <CheckCircle2 className="w-4 h-4" />,
    warn:    <AlertTriangle className="w-4 h-4" />,
    error:   <XCircle className="w-4 h-4" />
  };
  const tones = {
    info:    'bg-ink-900 text-white',
    success: 'bg-emerald-600 text-white',
    warn:    'bg-amber-500 text-white',
    error:   'bg-rose-600 text-white'
  };
  return (
    <div className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-lg animate-slide-up ${tones[kind] || tones.info}`}>
      {icons[kind] || icons.info}
      <span className="text-sm font-medium">{msg}</span>
    </div>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, size = 'md', footer }){
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }[size] || 'max-w-xl';
  return (
    <div className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${width} card p-5 animate-slide-up`}>
        {(title || onClose) && (
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold font-display">{title}</h3>
            <button aria-label="Close" onClick={onClose} className="p-1 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Progress bar ---------------- */
export function ProgressBar({ value, className = '' }){
  const pct = Math.max(0, Math.min(100, value || 0));
  return (
    <div className={`progress ${className}`}>
      <span style={{ width: pct + '%' }} />
    </div>
  );
}

/* ---------------- Small card wrapper ---------------- */
export function Card({ className = '', children, ...rest }){
  return <div className={`card p-4 ${className}`} {...rest}>{children}</div>;
}

/* ---------------- Section header ---------------- */
export function SectionTitle({ title, subtitle, actions }){
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">{title}</h1>
        {subtitle && <p className="text-ink-500 dark:text-ink-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------- Empty state ---------------- */
export function Empty({ icon, title, hint, action }){
  return (
    <div className="text-center py-10">
      <div className="text-5xl mb-2">{icon || '📘'}</div>
      <p className="font-semibold">{title}</p>
      {hint && <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/* ---------------- Simple markdown renderer ---------------- */
export function MD({ children, className = '' }){
  const html = simpleMD(children || '');
  return <div className={`md ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function simpleMD(t){
  if (!t) return '';
  let s = esc(t);
  s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>')
       .replace(/^## (.*)$/gm, '<h2>$1</h2>')
       .replace(/^# (.*)$/gm, '<h1>$1</h1>')
       .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
       .replace(/\*(.+?)\*/g, '<i>$1</i>')
       .replace(/`([^`]+)`/g, '<code>$1</code>');
  // lists
  s = s.replace(/(^|\n)([-*] .+(?:\n[-*] .+)*)/g, (_, nl, block) => {
    const items = block.split('\n').map(x => x.replace(/^[-*]\s+/, '')).map(x => `<li>${x}</li>`).join('');
    return `${nl}<ul>${items}</ul>`;
  });
  s = s.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
  return s;
}

/* ---------------- Keyboard hook ---------------- */
export function useEnterKey(ref, cb){
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const h = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); cb?.(); } };
    el.addEventListener('keydown', h);
    return () => el.removeEventListener('keydown', h);
  }, [cb]);
}
