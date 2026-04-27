import React, { useEffect, useState } from 'react';
import { getState, setState, subscribe } from './lib/storage.js';
import { getTheme, applyTheme } from './lib/theme.js';
import { ToastProvider } from './components/UI.jsx';
import Shell from './components/Shell.jsx';
import Dashboard from './views/Dashboard.jsx';
import Syllabus from './views/Syllabus.jsx';
import Planner from './views/Planner.jsx';
import Flashcards from './views/Flashcards.jsx';
import Quiz from './views/Quiz.jsx';
import Groups from './views/Groups.jsx';
import Tutor from './views/Tutor.jsx';
import Formulas from './views/Formulas.jsx';
import Reports from './views/Reports.jsx';
import Settings from './views/Settings.jsx';
import Onboarding from './components/Onboarding.jsx';

const VIEWS = {
  dashboard:  Dashboard,
  syllabus:   Syllabus,
  planner:    Planner,
  flashcards: Flashcards,
  quiz:       Quiz,
  formulas:   Formulas,
  groups:     Groups,
  tutor:      Tutor,
  reports:    Reports,
  settings:   Settings
};

export default function App(){
  const [view, setView] = useState(() => {
    const hash = (location.hash || '#dashboard').replace('#', '');
    return VIEWS[hash] ? hash : 'dashboard';
  });
  const [state, setLocalState] = useState(getState());
  const [showOnboard, setShowOnboard] = useState(!getState().profile.name);

  // Keep theme applied
  useEffect(() => { applyTheme(getTheme()); }, []);

  // Subscribe to state
  useEffect(() => subscribe(s => setLocalState({ ...s })), []);

  // Hash routing
  useEffect(() => {
    const onHash = () => {
      const h = (location.hash || '#dashboard').replace('#', '');
      setView(VIEWS[h] ? h : 'dashboard');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (v) => { location.hash = '#' + v; setView(v); };

  const View = VIEWS[view] || Dashboard;

  return (
    <ToastProvider>
      <Shell view={view} onNavigate={go} state={state}>
        <View go={go} state={state} />
      </Shell>
      {showOnboard && <Onboarding onDone={() => setShowOnboard(false)} />}
    </ToastProvider>
  );
}
