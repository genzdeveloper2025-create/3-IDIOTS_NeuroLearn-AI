import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/store';
import { exportStudentData } from '../lib/pdfExport';
import { motion, AnimatePresence } from 'motion/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { LogOut, Download, Award, Brain, Activity, Flame, Clock, Plus, X } from 'lucide-react';

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
      updateUser({ subjects: updatedSubjects });
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
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-900/50 p-6 rounded-2xl backdrop-blur-md border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-violet-500/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-gray-400">Level {currentUser.level} • {currentUser.xp} XP</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportStudentData(currentUser)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <Download size={18} /> Export PDF
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wellbeing Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity className="text-green-400" /> Wellbeing Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Health Score</span>
                <span className={currentUser.healthScore > 70 ? 'text-green-400' : 'text-yellow-400'}>{currentUser.healthScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className={`h-2 rounded-full ${currentUser.healthScore > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${currentUser.healthScore}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Focus Level</span>
                <span className="text-blue-400">{currentUser.focusLevel}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${currentUser.focusLevel}%` }}></div>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-sm text-gray-400">Burnout Risk</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentUser.burnoutRisk === 'Low' ? 'bg-green-500/20 text-green-400' : 
                currentUser.burnoutRisk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {currentUser.burnoutRisk}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Gamification & Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col justify-center items-center text-center">
          <div className="flex gap-8 w-full justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                <Flame className="text-orange-500" size={32} />
              </div>
              <span className="text-2xl font-bold">{currentUser.studyStreak}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Day Streak</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-2">
                <Award className="text-violet-500" size={32} />
              </div>
              <span className="text-2xl font-bold">{currentUser.level}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Current Level</span>
            </div>
          </div>
          {currentUser.lastQuizScore !== undefined && (
            <div className="mt-6 w-full p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-gray-400">Last Quiz: <span className="text-white font-medium">{currentUser.lastQuizSubject}</span></p>
              <p className="text-lg font-bold text-green-400">{currentUser.lastQuizScore}% Score</p>
            </div>
          )}
        </motion.div>

        {/* Live Study Timer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="text-blue-400" /> Live Study Session</h2>
          
          {!isStudying ? (
            <div className="flex-1 flex flex-col justify-center">
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4 text-white focus:ring-2 focus:ring-violet-500 outline-none"
                value={activeSubject || ''}
                onChange={(e) => setActiveSubject(e.target.value)}
              >
                <option value="" disabled>Select subject to study...</option>
                {currentUser.subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button 
                onClick={() => activeSubject && setIsStudying(true)}
                disabled={!activeSubject}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-lg font-semibold transition-all"
              >
                Start Timer
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-2">
                {formatTime(studyTimer)}
              </div>
              <p className="text-gray-400 mb-6">Studying: {currentUser.subjects.find(s => s.id === activeSubject)?.name}</p>
              <button 
                onClick={handleStopStudy}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-semibold transition-all"
              >
                Stop & Save
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts & Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Subject Progress Overview</h2>
            <button 
              onClick={() => setIsAddingSubject(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 rounded-lg transition-colors text-sm font-medium border border-violet-500/30"
            >
              <Plus size={16} /> Add Subject
            </button>
          </div>

          <AnimatePresence>
            {isAddingSubject && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddSubject}
                className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-white">Add New Subject</h3>
                  <button type="button" onClick={() => setIsAddingSubject(false)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Subject Name</label>
                    <input 
                      type="text" 
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g. Physics, History..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Target Hours</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newSubjectTargetHours}
                      onChange={(e) => setNewSubjectTargetHours(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Save Subject
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
                    <h3 className="font-medium">{subject.name}</h3>
                    <p className="text-xs text-gray-400">{subject.completedHours.toFixed(1)} / {subject.targetHours} hours</p>
                  </div>
                  <span className="font-bold" style={{ color: subject.color }}>{subject.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 relative"
                    style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 h-64">
             <Bar 
              data={hoursChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                  x: { grid: { display: false } }
                },
                plugins: { legend: { position: 'top' as const, labels: { color: 'white' } } }
              }} 
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col">
          <h2 className="text-lg font-semibold mb-6">Mastery Distribution</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[220px] aspect-square">
              <Doughnut 
                data={subjectChartData} 
                options={{
                  cutout: '75%',
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Brain className="text-slate-700 w-12 h-12" />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8 w-full">
              {currentUser.subjects.map(s => (
                <div key={s.id} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-gray-300">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
