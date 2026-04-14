import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../lib/store';
import { generateQuiz } from '../lib/quizEngine';
import { ChatMessage, QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Mic, Send, BrainCircuit, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Chatbot: React.FC = () => {
  const { currentUser, updateUser, addXP } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'Assistant' | 'Tutor'>('Tutor');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubject, setQuizSubject] = useState<string>('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved quiz state on mount
  useEffect(() => {
    const savedStateStr = localStorage.getItem('neurolearn_quiz_state');
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        if (savedState && savedState.activeQuiz && !savedState.quizCompleted) {
          setActiveQuiz(savedState.activeQuiz);
          setCurrentQuestionIndex(savedState.currentQuestionIndex);
          setQuizScore(savedState.quizScore);
          setShowExplanation(savedState.showExplanation);
          setSelectedOption(savedState.selectedOption);
          setQuizSubject(savedState.quizSubject);
          setQuizCompleted(savedState.quizCompleted);
          
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'ai',
            text: `I've restored your ongoing quiz on ${savedState.quizSubject}. Let's continue!`,
            timestamp: Date.now(),
            isQuiz: true
          }]);
        }
      } catch (e) {
        console.error('Failed to parse saved quiz state', e);
      }
    }
  }, []);

  // Save quiz state whenever it changes
  useEffect(() => {
    if (activeQuiz && !quizCompleted) {
      const stateToSave = {
        activeQuiz,
        currentQuestionIndex,
        quizScore,
        showExplanation,
        selectedOption,
        quizSubject,
        quizCompleted
      };
      localStorage.setItem('neurolearn_quiz_state', JSON.stringify(stateToSave));
    } else if (quizCompleted || !activeQuiz) {
      localStorage.removeItem('neurolearn_quiz_state');
    }
  }, [activeQuiz, currentQuestionIndex, quizScore, showExplanation, selectedOption, quizSubject, quizCompleted]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && currentUser) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: `SYSTEM ONLINE. WELCOME, ${currentUser.name.toUpperCase()}. COGNITIVE FOCUS: ${currentUser.focusLevel}%. HOW SHALL WE PROCEED?`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [isOpen, currentUser, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeQuiz, showExplanation]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    const newUserMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    // Check for quiz trigger
    if (text.toLowerCase().includes('quiz')) {
      // Try to extract subject
      let subject = '';
      if (currentUser) {
        const foundSubject = currentUser.subjects.find(s => text.toLowerCase().includes(s.name.toLowerCase()));
        if (foundSubject) subject = foundSubject.name;
      }
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        startQuiz(subject);
      }, 1500);
    } else {
      // Simple echo/assistant response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: `ANALYSIS COMPLETE. I AM CURRENTLY OPTIMIZED FOR DIAGNOSTIC QUIZZES. PLEASE REQUEST A "QUIZ" OR SELECT A PROTOCOL ABOVE.`,
          timestamp: Date.now()
        }]);
      }, 1500);
    }
  };

  const startQuiz = (subjectName?: string) => {
    const questions = generateQuiz(subjectName);
    setQuizSubject(subjectName || 'General Knowledge');
    setActiveQuiz(questions);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setQuizCompleted(false);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: `INITIATING DIAGNOSTIC PROTOCOL: ${subjectName || 'GENERAL KNOWLEDGE'}. AWAITING INPUT.`,
      timestamp: Date.now(),
      isQuiz: true
    }]);
  };

  const handleOptionSelect = (index: number, event: React.MouseEvent) => {
    if (showExplanation || !activeQuiz) return;
    
    setSelectedOption(index);
    setShowExplanation(true);
    
    const isCorrect = index === activeQuiz[currentQuestionIndex].correctAnswerIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x, y },
        colors: ['#00f0ff', '#0284c7', '#3b82f6'],
        disableForReducedMotion: true,
        ticks: 100,
        gravity: 0.8,
        scalar: 0.8
      });
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestionIndex < activeQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz || !currentUser) return;
    
    const finalScore = Math.round((quizScore / activeQuiz.length) * 100);
    const xpEarned = quizScore * 60;
    
    if (finalScore >= 50) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#0284c7', '#3b82f6']
      });
    }

    addXP(xpEarned);
    updateUser({ 
      lastQuizScore: finalScore,
      lastQuizSubject: quizSubject
    });

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: `DIAGNOSTIC COMPLETE. EFFICIENCY: ${finalScore}%. XP ALLOCATED: ${xpEarned}.`,
      timestamp: Date.now()
    }]);

    setQuizCompleted(true);
  };

  const handleVoiceInput = () => {
    // Simulate voice input
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-cyan-950/90 border border-cyan-500 text-cyan-400 px-6 py-3 font-mono text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.3)] z-[100] flex items-center gap-3 transition-all duration-300';
    toast.innerHTML = '<div class="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div> AUDIO STREAM DETECTED: INITIATING DIAGNOSTIC';
    document.body.appendChild(toast);
    
    // Slide in animation
    toast.animate([
      { transform: 'translate(-50%, 20px)', opacity: 0 },
      { transform: 'translate(-50%, 0)', opacity: 1 }
    ], { duration: 300, fill: 'forwards' });
    
    setTimeout(() => {
      toast.animate([
        { transform: 'translate(-50%, 0)', opacity: 1 },
        { transform: 'translate(-50%, -20px)', opacity: 0 }
      ], { duration: 300, fill: 'forwards' }).onfinish = () => {
        document.body.removeChild(toast);
      };
      handleSend('Start a random quiz');
    }, 2000);
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Floating Orb */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-cyan-950/80 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] z-50 border border-cyan-500/50 relative overflow-hidden group"
        >
          <div className="absolute inset-0 border-[3px] border-cyan-500/30 rounded-full animate-spin-slow border-t-cyan-400"></div>
          <div className="absolute inset-2 border border-blue-500/30 rounded-full animate-spin-slow-reverse"></div>
          <BrainCircuit className="text-cyan-400 w-8 h-8 relative z-10 group-hover:animate-pulse" />
        </motion.button>
      )}

      {/* Fullscreen Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-slate-950/80 relative">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-950/50 flex items-center justify-center border border-cyan-500/50 relative">
                  <div className="absolute inset-0 border-[2px] border-cyan-500/30 rounded-full animate-spin-slow border-t-cyan-400"></div>
                  <BrainCircuit className="text-cyan-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-cyan-400 tracking-widest uppercase neon-text">NEURO.AI</h3>
                  <div className="flex gap-2 mt-1">
                    <button 
                      onClick={() => setMode('Assistant')}
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 transition-all border ${mode === 'Assistant' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-transparent text-cyan-700 border-cyan-900 hover:text-cyan-500'}`}
                    >
                      Assistant
                    </button>
                    <button 
                      onClick={() => setMode('Tutor')}
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 transition-all border ${mode === 'Tutor' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-transparent text-cyan-700 border-cyan-900 hover:text-cyan-500'}`}
                    >
                      Tutor
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-cyan-600 hover:text-cyan-400 hover:bg-cyan-950/50 transition-colors border border-transparent hover:border-cyan-800">
                <X size={24} />
              </button>
            </div>

            {/* Quick Action Chips (Tutor Mode) */}
            {mode === 'Tutor' && !activeQuiz && (
              <div className="flex overflow-x-auto p-4 gap-2 border-b border-cyan-900/30 custom-scrollbar">
                <button 
                  onClick={() => handleSend('Start a random quiz')}
                  className="whitespace-nowrap px-4 py-1.5 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-400 text-[10px] font-mono uppercase tracking-widest border border-cyan-500/30 transition-all hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-2 animate-pulse"></span>
                  Random Diagnostic
                </button>
                {currentUser.subjects.map(sub => (
                  <button 
                    key={sub.id}
                    onClick={() => handleSend(`Quiz on ${sub.name}`)}
                    className="whitespace-nowrap px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-600 hover:text-cyan-400 text-[10px] font-mono uppercase tracking-widest border border-cyan-900 transition-colors"
                  >
                    Diagnostic: {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
                  <div className={`max-w-[80%] p-4 font-mono text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-950/80 text-cyan-100 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                      : 'bg-slate-900/80 text-cyan-400 border border-cyan-900 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                  }`}>
                    {msg.sender === 'ai' && <div className="text-[10px] text-cyan-600 mb-1 uppercase tracking-widest">NEURO.AI_RESPONSE</div>}
                    {msg.sender === 'user' && <div className="text-[10px] text-cyan-500/50 mb-1 uppercase tracking-widest text-right">USER_INPUT</div>}
                    <div className="uppercase">{msg.text}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start relative z-10">
                  <div className="max-w-[80%] p-4 font-mono text-sm bg-slate-900/80 text-cyan-400 border border-cyan-900 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                    <div className="text-[10px] text-cyan-600 mb-2 uppercase tracking-widest">NEURO.AI_PROCESSING</div>
                    <div className="flex gap-1 items-center h-4">
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 bg-cyan-500"></motion.div>
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 bg-cyan-500"></motion.div>
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 bg-cyan-500"></motion.div>
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }} className="w-1.5 bg-cyan-500"></motion.div>
                      <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.8 }} className="w-1.5 bg-cyan-500"></motion.div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active Quiz UI */}
              {activeQuiz && !quizCompleted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hud-panel p-6 max-w-2xl mx-auto w-full relative z-10"
                >
                  <div className="hud-bracket-tl"></div>
                  <div className="hud-bracket-tr"></div>
                  <div className="hud-bracket-bl"></div>
                  <div className="hud-bracket-br"></div>
                  <div className="flex justify-between text-[10px] font-mono text-cyan-500 mb-4 uppercase tracking-widest border-b border-cyan-900/50 pb-2">
                    <span>DIAGNOSTIC {currentQuestionIndex + 1} OF {activeQuiz.length}</span>
                    <span>EFFICIENCY: {quizScore}</span>
                  </div>
                  
                  <h4 className="text-lg text-cyan-100 font-mono font-bold mb-6 uppercase">{activeQuiz[currentQuestionIndex].text}</h4>
                  
                  <div className="space-y-3">
                    {activeQuiz[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === activeQuiz[currentQuestionIndex].correctAnswerIndex;
                      
                      let btnClass = "w-full text-left p-4 font-mono text-sm uppercase transition-all flex items-center justify-between border ";
                      let animationProps: any = {};
                      
                      if (!showExplanation) {
                        btnClass += "bg-slate-950 border-cyan-900 hover:border-cyan-500 hover:bg-cyan-950/50 text-cyan-300 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]";
                      } else {
                        if (isCorrect) {
                          btnClass += "bg-cyan-900/40 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(0,240,255,0.4)]";
                          if (isSelected) {
                            animationProps = { animate: { scale: [1, 1.02, 1] }, transition: { duration: 0.3 } };
                          } else {
                            animationProps = { 
                              animate: { opacity: [0.5, 1, 0.5], borderColor: ["rgba(0,240,255,0.2)", "rgba(0,240,255,0.8)", "rgba(0,240,255,0.2)"] }, 
                              transition: { repeat: Infinity, duration: 1.5 } 
                            };
                          }
                        } else if (isSelected) {
                          btnClass += "bg-red-950/40 border-red-500 text-red-300 shadow-[0_0_15px_rgba(255,50,50,0.4)]";
                          animationProps = { animate: { x: [-5, 5, -5, 5, 0] }, transition: { duration: 0.4 } };
                        } else {
                          btnClass += "bg-slate-950 border-slate-900 text-cyan-800 opacity-50";
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          disabled={showExplanation}
                          onClick={(e) => handleOptionSelect(idx, e as any)}
                          className={btnClass}
                          {...animationProps}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-950/80 border border-cyan-800 flex items-center justify-center font-bold text-cyan-500">
                              {['A', 'B', 'C', 'D'][idx]}
                            </span>
                            {option}
                          </span>
                          {showExplanation && isCorrect && <CheckCircle2 className="text-cyan-400" />}
                          {showExplanation && isSelected && !isCorrect && <XCircle className="text-red-500" />}
                        </motion.button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <div className={`p-4 mb-4 border relative overflow-hidden ${selectedOption === activeQuiz[currentQuestionIndex].correctAnswerIndex ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-100' : 'bg-red-950/30 border-red-500/50 text-red-100'}`}>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
                        <div className="flex items-center gap-2 font-mono font-bold mb-2 text-sm uppercase tracking-widest">
                          {selectedOption === activeQuiz[currentQuestionIndex].correctAnswerIndex ? (
                            <><CheckCircle2 className="text-cyan-400" size={16} /> <span className="text-cyan-400 neon-text">ANALYSIS: CORRECT</span></>
                          ) : (
                            <><XCircle className="text-red-400" size={16} /> <span className="text-red-400 neon-text-red">ANALYSIS: INCORRECT</span></>
                          )}
                        </div>
                        <p className="text-xs font-mono leading-relaxed opacity-90 uppercase">{activeQuiz[currentQuestionIndex].explanation}</p>
                      </div>
                      <button 
                        onClick={handleNextQuestion}
                        className="w-full py-3 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/50 font-mono text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      >
                        {currentQuestionIndex < activeQuiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Quiz Completed UI */}
              {activeQuiz && quizCompleted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hud-panel p-8 max-w-2xl mx-auto w-full text-center relative z-10"
                >
                  <div className="hud-bracket-tl"></div>
                  <div className="hud-bracket-tr"></div>
                  <div className="hud-bracket-bl"></div>
                  <div className="hud-bracket-br"></div>
                  <div className="w-20 h-20 mx-auto bg-cyan-950/50 border border-cyan-500/50 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-[2px] border-cyan-500/30 rounded-full animate-spin-slow border-t-cyan-400"></div>
                    <Award className="text-cyan-400 w-10 h-10" />
                  </div>
                  <h4 className="text-2xl text-cyan-100 font-mono font-bold mb-2 uppercase neon-text">Diagnostic Complete</h4>
                  <p className="text-cyan-600 font-mono text-sm mb-8 uppercase tracking-widest">
                    Efficiency: <span className="text-cyan-400 font-bold neon-text">{Math.round((quizScore / activeQuiz.length) * 100)}%</span> // XP Earned: <span className="text-cyan-400 font-bold">{quizScore * 60}</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => startQuiz(quizSubject)}
                      className="px-6 py-3 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/50 font-mono text-sm uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={16} /> Re-run Diagnostic
                    </button>
                    <button 
                      onClick={() => { setActiveQuiz(null); setQuizCompleted(false); }}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-cyan-600 hover:text-cyan-400 border border-cyan-900 font-mono text-sm uppercase tracking-widest transition-colors"
                    >
                      Return to Interface
                    </button>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-cyan-900/50 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <button 
                  type="button"
                  onClick={handleVoiceInput}
                  className="p-3 bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-800 text-cyan-500 hover:text-cyan-300 rounded-none transition-colors"
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeQuiz ? "DIAGNOSTIC IN PROGRESS..." : "ENTER COMMAND OR QUERY..."}
                  disabled={activeQuiz !== null}
                  className="flex-1 bg-slate-900 border border-cyan-800 px-6 py-3 text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] disabled:opacity-50 uppercase placeholder:text-cyan-800"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || activeQuiz !== null}
                  className="p-3 bg-cyan-950/80 hover:bg-cyan-900 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-slate-700 text-cyan-400 border border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
