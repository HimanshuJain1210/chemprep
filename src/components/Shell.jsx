import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, BookOpen, CalendarDays, Layers, Brain, Users, Sparkles,
  FlaskConical, FileText, Settings as SettingsIcon, Sun, Moon, Laptop, Flame
} from 'lucide-react';
import { getTheme, applyTheme } from '../lib/theme.js';

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'syllabus',   label: 'Syllabus',   icon: BookOpen },
  { id: 'planner',    label: 'Planner',    icon: CalendarDays },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz',       label: 'Quiz',       icon: Brain },
  { id: 'formulas',   label: 'Formulas',   icon: FlaskConical },
  { id: 'groups',     label: 'Groups',     icon: Users },
  { id: 'tutor',      label: 'Tutor',      icon: Sparkles },
  { id: 'reports',    label: 'Reports',    icon: FileText }
];

// Mobile bottom nav — 5 most-used
const MOBILE_NAV = ['dashboard','syllabus','flashcards','tutor','planner'];

export default function Shell({ view, onNavigate, state, children }){
  const [themeMode, setThemeMode] = useState(getTheme());

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  const cycleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(next);
    applyTheme(next);
  };

  const ThemeIcon = themeMode === 'light' ? Sun : themeMode === 'dark' ? Moon : Laptop;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* ----- Top bar ----- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-ink-950/80 backdrop-blur border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold leading-tight">ChemPrep</div>
              <div className="text-[10px] text-ink-500 dark:text-ink-400 leading-tight -mt-0.5">JEE · NEET Chemistry</div>
            </div>
          </button>

          {/* Desktop tabs */}
          <nav className="ml-4 hidden lg:flex items-center gap-1 overflow-x-auto">
            {NAV.map(n => (
              <button key={n.id}
                onClick={() => onNavigate(n.id)}
                className={`nav-btn ${view === n.id ? 'active' : ''}`}>
                <n.icon className="w-4 h-4" />
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="chip chip-amber" title="Your daily study streak">
              <Flame className="w-3.5 h-3.5" />
              <span>{state.streak?.count || 0}d</span>
            </div>
            <button onClick={cycleTheme}
              className="p-2 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-300"
              title={`Theme: ${themeMode} (click to switch)`}>
              <ThemeIcon className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate('settings')}
              className="p-2 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-300"
              title="Settings">
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tablet tab row (md only) */}
        <div className="lg:hidden px-2 sm:px-3 pb-2 flex gap-1 overflow-x-auto no-scrollbar">
          {NAV.map(n => (
            <button key={n.id} onClick={() => onNavigate(n.id)}
              className={`nav-btn shrink-0 ${view === n.id ? 'active' : ''}`}>
              <n.icon className="w-4 h-4" />
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ----- Main ----- */}
      <main className="max-w-7xl mx-auto px-3 sm:px-5 py-5 sm:py-7">
        {children}
      </main>

      {/* ----- Mobile bottom nav ----- */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 safe-bottom bg-white/95 dark:bg-ink-950/95 backdrop-blur border-t border-ink-200 dark:border-ink-800">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(id => {
            const n = NAV.find(x => x.id === id);
            const active = view === id;
            return (
              <button key={id} onClick={() => onNavigate(id)}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${active ? 'text-brand-600' : 'text-ink-500 dark:text-ink-400'}`}>
                <n.icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
                <span>{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
