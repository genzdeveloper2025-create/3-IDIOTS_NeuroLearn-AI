import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/store';
import { exportStudentData } from '../lib/pdfExport';
import { motion, AnimatePresence } from 'motion/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { LogOut, Download, Award, Brain, Activity, Flame, Clock, Plus, X, Calendar } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const Dashboard: React.FC = () => {
  const { currentUser, logout, updateUser } = useAppContext();
  const [studyTimer, setStudyTimer] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectTargetHours, setNewSubjectTargetHours] = useState(10);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !currentUser) return;

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newSubject = {
      id: `sub_${Date.now()}`,
      name: newSubjectName.trim(),
      progress: 0,
      targetHours: newSubjectTargetHours,
      completedHours: 0,
      color: randomColor
    };

    updateUser({
      subjects: [...currentUser.subjects, newSubject]
    });

    setNewSubjectName('');
    setNewSubjectTargetHours(10);
    setIsAddingSubject(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStopStudy = () => {
    setIsStudying(false);
    if (activeSubject && currentUser && studyTimer > 60) {
      const hoursStudied = studyTimer / 3600;
      const updatedSubjects = currentUser.subjects.map(sub => {
        if (sub.id === activeSubject) {
          const newCompleted = sub.completedHours + hoursStudied;
          return {
            ...sub,
            completedHours: newCompleted,
            progress: Math.min(100, Math.round((newCompleted / sub.targetHours) * 100))
          };
        }
        return sub;
      });
      
      const today = new Date().toISOString().split('T')[0];
      const currentHistory = currentUser.studyHistory || [];
      const todayEntryIndex = currentHistory.findIndex(h => h.date === today);
      
      let updatedHistory = [...currentHistory];
      if (todayEntryIndex >= 0) {
        updatedHistory[todayEntryIndex] = {
          ...updatedHistory[todayEntryIndex],
          hours: Number((updatedHistory[todayEntryIndex].hours + hoursStudied).toFixed(2))
        };
      } else {
        updatedHistory.push({
          date: today,
          hours: Number(hoursStudied.toFixed(2))
        });
      }

      updateUser({ 
        subjects: updatedSubjects,
        studyHistory: updatedHistory
      });
    }
    setStudyTimer(0);
    setActiveSubject(null);
  };

  if (!currentUser) return null;

  const subjectChartData = {
    labels: currentUser.subjects.map(s => s.name),
    datasets: [
      {
        data: currentUser.subjects.map(s => s.progress),
        backgroundColor: currentUser.subjects.map(s => s.color),
        borderWidth: 0,
      },
    ],
  };

  const hoursChartData = {
    labels: currentUser.subjects.map(s => s.name),
    datasets: [
      {
        label: 'Completed Hours',
        data: currentUser.subjects.map(s => s.completedHours),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      },
      {
        label: 'Target Hours',
        data: currentUser.subjects.map(s => s.targetHours),
        backgroundColor: 'rgba(71, 85, 105, 0.5)',
      }
    ],
  };

  return (
    <div className="min-h-screen text-cyan-50 p-4 md:p-8 pb-24 relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 hud-panel p-6 rounded-none">
        <div className="hud-bracket-tl"></div>
        <div className="hud-bracket-tr"></div>
        <div className="hud-bracket-bl"></div>
        <div className="hud-bracket-br"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-400 flex items-center justify-center text-2xl font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)] relative">
            <div className="absolute inset-0 border-t-2 border-cyan-300 rounded-full animate-spin-slow"></div>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono tracking-widest uppercase neon-text">{currentUser.name}</h1>
            <p className="text-cyan-500/80 font-mono text-sm">LVL {currentUser.level} // {currentUser.xp} XP</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportStudentData(currentUser)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-950/50 hover:bg-cyan-900/80 text-cyan-400 rounded-none transition-all border border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] font-mono text-sm uppercase"
          >
            <Download size={16} /> Export Data
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 rounded-none transition-all border border-red-500/50 hover:shadow-[0_0_15px_rgba(255,50,50,0.4)] font-mono text-sm uppercase"
          >
            <LogOut size={16} /> Terminate
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wellbeing Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hud-panel p-6 rounded-none">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>
          <h2 className="text-sm font-mono tracking-widest text-cyan-500 mb-4 flex items-center gap-2 uppercase"><Activity className="text-cyan-400" size={16} /> Bio-Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 uppercase">
                <span className="text-cyan-600">Health Status</span>
                <span className={currentUser.healthScore > 70 ? 'text-cyan-400 neon-text' : 'text-orange-400 neon-text-orange'}>{currentUser.healthScore}%</span>
              </div>
              <div className="w-full bg-slate-900 border border-cyan-900 rounded-none h-1.5 relative overflow-hidden">
                <div className={`h-full ${currentUser.healthScore > 70 ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`} style={{ width: `${currentUser.healthScore}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 uppercase">
                <span className="text-cyan-600">Cognitive Focus</span>
                <span className="text-blue-400 neon-text">{currentUser.focusLevel}%</span>
              </div>
              <div className="w-full bg-slate-900 border border-blue-900 rounded-none h-1.5 relative overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" style={{ width: `${currentUser.focusLevel}%` }}></div>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-cyan-900/50">
              <span className="text-xs font-mono text-cyan-600 uppercase">System Load</span>
              <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase ${
                currentUser.burnoutRisk === 'Low' ? 'border-cyan-500 text-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 
                currentUser.burnoutRisk === 'Medium' ? 'border-orange-500 text-orange-400 shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 
                'border-red-500 text-red-400 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
              }`}>
                {currentUser.burnoutRisk}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Gamification & Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hud-panel p-6 rounded-none flex flex-col justify-center items-center text-center">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>
          <div className="flex gap-8 w-full justify-center">
            <div className="flex flex-col items-center relative">
              <div className="absolute inset-0 border border-orange-500/30 rounded-full animate-spin-slow"></div>
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Flame className="text-orange-400" size={28} />
              </div>
              <span className="text-2xl font-mono font-bold neon-text-orange">{currentUser.studyStreak}</span>
              <span className="text-[10px] text-orange-500/70 font-mono uppercase tracking-widest">Uplink Streak</span>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-spin-slow-reverse"></div>
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Award className="text-cyan-400" size={28} />
              </div>
              <span className="text-2xl font-mono font-bold neon-text">{currentUser.level}</span>
              <span className="text-[10px] text-cyan-500/70 font-mono uppercase tracking-widest">Clearance</span>
            </div>
          </div>
          {currentUser.lastQuizScore !== undefined && (
            <div className="mt-6 w-full p-3 bg-cyan-950/30 border border-cyan-800/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <p className="text-[10px] font-mono text-cyan-600 uppercase">Last Diagnostic: <span className="text-cyan-400">{currentUser.lastQuizSubject}</span></p>
              <p className="text-lg font-mono font-bold text-cyan-300 neon-text mt-1">{currentUser.lastQuizScore}% Efficiency</p>
            </div>
          )}
        </motion.div>

        {/* Live Study Timer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="hud-panel p-6 rounded-none flex flex-col">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>
          <h2 className="text-sm font-mono tracking-widest text-cyan-500 mb-4 flex items-center gap-2 uppercase"><Clock className="text-cyan-400" size={16} /> Active Session</h2>
          
          {!isStudying ? (
            <div className="flex-1 flex flex-col justify-center">
              <select 
                className="w-full bg-slate-900 border border-cyan-800 p-3 mb-4 text-cyan-100 font-mono text-sm focus:ring-1 focus:ring-cyan-500 outline-none appearance-none"
                value={activeSubject || ''}
                onChange={(e) => setActiveSubject(e.target.value)}
              >
                <option value="" disabled>SELECT MODULE...</option>
                {currentUser.subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                ))}
              </select>
              <button 
                onClick={() => activeSubject && setIsStudying(true)}
                disabled={!activeSubject}
                className="w-full py-3 bg-cyan-950/50 hover:bg-cyan-900/80 disabled:opacity-50 text-cyan-400 font-mono text-sm uppercase tracking-widest transition-all border border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

                Start Timer
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 border-[4px] border-cyan-500/20 rounded-full animate-spin-slow border-t-cyan-400 w-32 h-32 mx-auto top-1/2 -translate-y-1/2"></div>
              <div className="text-4xl font-mono font-bold neon-text text-cyan-300 mb-2 relative z-10">
                {formatTime(studyTimer)}
              </div>
              <p className="text-cyan-500/80 font-mono text-xs uppercase tracking-widest mb-6 relative z-10">MODULE: {currentUser.subjects.find(s => s.id === activeSubject)?.name}</p>
              <button 
                onClick={handleStopStudy}
                className="w-full py-3 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/50 transition-all font-mono text-sm uppercase tracking-widest hover:shadow-[0_0_15px_rgba(255,50,50,0.4)] relative z-10"
              >
                Terminate & Save
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 hud-panel p-6 rounded-none">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>
          <div className="flex justify-between items-center mb-6 border-b border-cyan-900/50 pb-4">
            <h2 className="text-sm font-mono tracking-widest text-cyan-500 uppercase">Module Progress Overview</h2>
            <button 
              onClick={() => setIsAddingSubject(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/80 text-cyan-400 transition-all text-xs font-mono uppercase border border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            >
              <Plus size={14} /> Init Module
            </button>
          </div>

          <AnimatePresence>
            {isAddingSubject && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddSubject}
                className="mb-8 p-4 bg-slate-950 border border-cyan-800 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-mono text-cyan-400 text-xs uppercase">Initialize New Module</h3>
                  <button type="button" onClick={() => setIsAddingSubject(false)} className="text-cyan-600 hover:text-cyan-400">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase">Module Designation</label>
                    <input 
                      type="text" 
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g. QUANTUM MECHANICS"
                      className="w-full bg-slate-900 border border-cyan-800 px-3 py-2 text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase">Target Duration (HRS)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newSubjectTargetHours}
                      onChange={(e) => setNewSubjectTargetHours(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-cyan-800 px-3 py-2 text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 font-mono text-xs uppercase transition-all border border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                  >
                    Execute
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {currentUser.subjects.map(subject => (
              <div key={subject.id}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-mono text-cyan-100 uppercase text-sm tracking-wider">{subject.name}</h3>
                    <p className="text-[10px] font-mono text-cyan-600">{subject.completedHours.toFixed(1)} / {subject.targetHours} HRS</p>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 neon-text">{subject.progress}%</span>
                </div>
                <div className="w-full bg-slate-900 border border-cyan-900 h-1.5 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 relative"
                    style={{ width: `${subject.progress}%`, backgroundColor: subject.color, boxShadow: `0 0 10px ${subject.color}` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 h-64 border border-cyan-900/50 p-4 bg-slate-950/50 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
             <Bar 
              data={hoursChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(6,182,212,0.1)' }, ticks: { color: '#06b6d4', font: { family: 'monospace' } } },
                  x: { grid: { display: false }, ticks: { color: '#06b6d4', font: { family: 'monospace' } } }
                },
                plugins: { legend: { position: 'top' as const, labels: { color: '#06b6d4', font: { family: 'monospace' } } } }
              }} 
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="hud-panel p-6 rounded-none flex flex-col h-full">
          <div className="hud-bracket-tl"></div>
          <div className="hud-bracket-tr"></div>
          <div className="hud-bracket-bl"></div>
          <div className="hud-bracket-br"></div>
          <h2 className="text-sm font-mono tracking-widest text-cyan-500 mb-6 shrink-0 uppercase">Data Distribution</h2>
          <div className="flex-1 flex flex-col items-center justify-between min-h-0">
            <div className="relative w-full max-w-[220px] aspect-square shrink-0">
              <div className="absolute inset-[-20px] border border-cyan-500/20 rounded-full animate-spin-slow border-t-cyan-400"></div>
              <div className="absolute inset-[-10px] border border-blue-500/20 rounded-full animate-spin-slow-reverse border-b-blue-400"></div>
              <Doughnut 
                data={subjectChartData} 
                options={{
                  cutout: '80%',
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  elements: {
                    arc: {
                      borderWidth: 1,
                      borderColor: '#020617'
                    }
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Brain className="text-cyan-500/50 w-12 h-12" />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-8 w-full overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
              {currentUser.subjects.map(s => (
                <div key={s.id} className="flex items-center gap-2 text-[10px] font-mono uppercase bg-cyan-950/30 px-3 py-1.5 border border-cyan-800/50">
                  <span className="w-2 h-2 shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 5px ${s.color}` }}></span>
                  <span className="text-cyan-300 truncate max-w-[120px]">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      {/* Study Activity Calendar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 hud-panel p-6 rounded-none">
        <div className="hud-bracket-tl"></div>
        <div className="hud-bracket-tr"></div>
        <div className="hud-bracket-bl"></div>
        <div className="hud-bracket-br"></div>
        <div className="flex items-center gap-2 mb-6 border-b border-cyan-900/50 pb-4">
          <Calendar className="text-cyan-400" size={16} />
          <h2 className="text-sm font-mono tracking-widest text-cyan-500 uppercase">Activity Matrix</h2>
        </div>
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[600px] pt-10">
            <div className="flex gap-1">
              {Array.from({ length: 12 }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const daysAgo = (11 - weekIdx) * 7 + (6 - dayIdx);
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    const historyEntry = currentUser.studyHistory?.find(h => h.date === dateStr);
                    const hours = historyEntry ? historyEntry.hours : 0;
                    
                    let bgClass = 'bg-slate-900 border-slate-800';
                    if (hours > 0 && hours <= 1) bgClass = 'bg-cyan-900/40 border-cyan-900';
                    else if (hours > 1 && hours <= 2) bgClass = 'bg-cyan-700/60 border-cyan-700';
                    else if (hours > 2 && hours <= 3) bgClass = 'bg-cyan-500/80 border-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]';
                    else if (hours > 3) bgClass = 'bg-cyan-400 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]';

                    return (
                      <div 
                        key={dayIdx} 
                        className={`w-4 h-4 border ${bgClass} transition-colors hover:border-white cursor-pointer relative group`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-cyan-950 text-cyan-400 font-mono text-[10px] uppercase opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 border border-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                          {date.toLocaleDateString()}: {hours} HRS
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-cyan-600 uppercase justify-end">
              <span>Min</span>
              <div className="w-3 h-3 border bg-slate-900 border-slate-800"></div>
              <div className="w-3 h-3 border bg-cyan-900/40 border-cyan-900"></div>
              <div className="w-3 h-3 border bg-cyan-700/60 border-cyan-700"></div>
              <div className="w-3 h-3 border bg-cyan-500/80 border-cyan-500"></div>
              <div className="w-3 h-3 border bg-cyan-400 border-cyan-300"></div>
              <span>Max</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
