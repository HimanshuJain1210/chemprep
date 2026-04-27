import React, { useMemo, useRef } from 'react';
import { Card, SectionTitle, ProgressBar } from '../components/UI.jsx';
import { SYLLABUS, BRANCHES } from '../data/syllabus.js';
import { weekRange } from '../lib/storage.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Clock, FileText, Brain, Target } from 'lucide-react';

const COLORS = ['#f97316', '#10b981', '#0ea5e9', '#6366f1', '#f43f5e'];

export default function Reports({ state }){
  const reportRef = useRef(null);

  const doneCount = SYLLABUS.filter(t => state.syllabus[t.id]?.status === 'done').length;
  const doingCount = SYLLABUS.filter(t => state.syllabus[t.id]?.status === 'doing').length;
  const todoCount = SYLLABUS.length - doneCount - doingCount;
  const overallPct = Math.round((doneCount / SYLLABUS.length) * 100);

  const weekData = useMemo(() => {
    return weekRange().map(d => ({
      d: new Date(d).toLocaleDateString(undefined, { weekday: 'short' }),
      mins: state.planner.logs[d]?.studiedMins || 0,
      screen: state.planner.logs[d]?.screenMins || 0
    }));
  }, [state.planner.logs]);

  const branchStats = BRANCHES.map(b => {
    const all = SYLLABUS.filter(t => t.branch === b.id);
    const d = all.filter(t => state.syllabus[t.id]?.status === 'done').length;
    return { name: b.name, value: d, total: all.length, pct: Math.round((d / all.length) * 100) };
  });

  const quizAvg = state.quizHistory.length
    ? Math.round(state.quizHistory.reduce((s, q) => s + (q.score / q.total), 0) / state.quizHistory.length * 100)
    : 0;

  const weeklyMins = weekData.reduce((s, d) => s + d.mins, 0);

  const exportPDF = async () => {
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      const el = reportRef.current;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff' });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 40;
      const imgH = canvas.height * (imgW / canvas.width);
      let y = 20;
      // If taller than one page, split
      if (imgH <= pageH - 40){
        pdf.addImage(img, 'PNG', 20, y, imgW, imgH);
      } else {
        // paginate by slicing
        const srcRatio = canvas.width / imgW;
        const sliceH = (pageH - 40) * srcRatio;
        let sY = 0;
        while (sY < canvas.height){
          const c = document.createElement('canvas');
          c.width = canvas.width; c.height = Math.min(sliceH, canvas.height - sY);
          c.getContext('2d').drawImage(canvas, 0, sY, canvas.width, c.height, 0, 0, canvas.width, c.height);
          const slice = c.toDataURL('image/png');
          pdf.addImage(slice, 'PNG', 20, 20, imgW, c.height / srcRatio);
          sY += sliceH;
          if (sY < canvas.height) pdf.addPage();
        }
      }
      pdf.save(`ChemPrep-Weekly-${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e){
      alert('PDF export failed: ' + (e.message || e));
    }
  };

  return (
    <div>
      <SectionTitle
        title="Reports"
        subtitle="A weekly audit of your preparation. Share this PDF with a parent, mentor, or just future-you."
        actions={
          <button className="btn-primary" onClick={exportPDF}><Download className="w-4 h-4" />Export PDF</button>
        }
      />

      <div ref={reportRef} className="bg-white dark:bg-ink-950 p-1">
        {/* Header inside the report */}
        <div className="card p-5 mb-4">
          <h2 className="text-xl font-display font-bold">Weekly progress — {state.profile.name || 'Student'}</h2>
          <p className="text-sm text-ink-500">
            Class {state.profile.cls} · Generated {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            {state.profile.targetDate && ` · Target: ${new Date(state.profile.targetDate).toLocaleDateString()}`}
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card>
            <div className="flex items-center justify-between"><span className="label">Overall</span><TrendingUp className="w-4 h-4 text-brand-500" /></div>
            <div className="text-2xl font-bold mt-1">{overallPct}%</div>
            <ProgressBar value={overallPct} className="mt-2" />
            <div className="text-[11px] text-ink-500 mt-1">{doneCount}/{SYLLABUS.length} topics</div>
          </Card>
          <Card>
            <div className="flex items-center justify-between"><span className="label">This week</span><Clock className="w-4 h-4 text-emerald-600" /></div>
            <div className="text-2xl font-bold mt-1">{weeklyMins} <span className="text-xs font-normal text-ink-500">min</span></div>
            <div className="text-[11px] text-ink-500 mt-1">Target {state.profile.weekTargetMins || 1500} min</div>
          </Card>
          <Card>
            <div className="flex items-center justify-between"><span className="label">Quiz avg</span><Brain className="w-4 h-4 text-indigo-600" /></div>
            <div className="text-2xl font-bold mt-1">{quizAvg}%</div>
            <div className="text-[11px] text-ink-500 mt-1">{state.quizHistory.length} attempt(s)</div>
          </Card>
          <Card>
            <div className="flex items-center justify-between"><span className="label">Streak</span><Target className="w-4 h-4 text-rose-600" /></div>
            <div className="text-2xl font-bold mt-1">{state.streak?.count || 0} <span className="text-xs font-normal text-ink-500">days</span></div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-3 mb-4">
          <Card>
            <h3 className="font-semibold mb-2">Minutes studied this week</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
                  <XAxis dataKey="d" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="mins" fill="#f97316" radius={[6,6,0,0]} />
                  <Bar dataKey="screen" fill="#64748b" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-ink-500 mt-2">Orange = study · Grey = screen time</div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Syllabus by branch</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={branchStats} dataKey="value" nameKey="name" innerRadius={40} outerRadius={75} paddingAngle={3}>
                    {branchStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              {branchStats.map((b, i) => (
                <div key={b.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                  <span>{b.name}: {b.value}/{b.total}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Backlogs + mentor note */}
        <div className="grid lg:grid-cols-2 gap-3 mb-4">
          <Card>
            <h3 className="font-semibold mb-2 flex items-center gap-1"><FileText className="w-4 h-4" />Topic status</h3>
            <div className="grid grid-cols-3 text-center gap-2">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{doneCount}</div>
                <div className="text-[11px] text-ink-500">Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{doingCount}</div>
                <div className="text-[11px] text-ink-500">In progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink-500">{todoCount}</div>
                <div className="text-[11px] text-ink-500">To-do</div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-2">Prof. Arjun's weekly note</h3>
            <p className="text-sm italic text-ink-600 dark:text-ink-300">
              {mentorNote({ weeklyMins, target: state.profile.weekTargetMins || 1500, quizAvg, overallPct, streak: state.streak?.count || 0 })}
            </p>
          </Card>
        </div>

        <div className="text-[10px] text-ink-400 text-center mt-4">ChemPrep · Personal study report · Not for distribution</div>
      </div>
    </div>
  );
}

function mentorNote({ weeklyMins, target, quizAvg, overallPct, streak }){
  const hit = weeklyMins >= target;
  const lines = [];
  if (streak >= 14) lines.push(`A ${streak}-day streak is real momentum — don't break it for anything this weekend.`);
  else if (streak >= 3) lines.push(`Streak of ${streak} days. Good. Push to 14 and the habit stops feeling like effort.`);
  else lines.push(`Streak is short — the only fix is to show up tomorrow. No shortcut.`);
  if (hit) lines.push(`You hit your weekly target (${weeklyMins}/${target} min). Keep the intensity, not just the clock.`);
  else lines.push(`Short of target this week (${weeklyMins}/${target} min). Look at your plan — is a block too long? Shorten it.`);
  if (quizAvg >= 70) lines.push(`Quiz average ${quizAvg}% is solid. Move to tougher sets.`);
  else if (quizAvg > 0) lines.push(`Quiz average ${quizAvg}% — slow down. Review WHY each wrong answer was wrong, not just the correct one.`);
  if (overallPct < 40) lines.push(`Syllabus coverage is early. Don't panic — pick two high-weight chapters and finish them this week.`);
  return lines.join(' ');
}
