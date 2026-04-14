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
          text: `Hi ${currentUser.name}! I'm NEURO, your AI learning companion. Your focus is at ${currentUser.focusLevel}% today. How can I help you?`,
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
      startQuiz(subject);
    } else {
      // Simple echo/assistant response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: `I'm currently optimized for quizzes in this demo. Try asking me for a "quiz" or select a subject chip above!`,
          timestamp: Date.now()
        }]);
      }, 1000);
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
      text: `Starting a quiz on ${subjectName || 'General Knowledge'}! Good luck!`,
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
        colors: ['#22c55e', '#10b981', '#34d399'],
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
        origin: { y: 0.6 }
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
      text: `Quiz complete! You scored ${finalScore}% and earned ${xpEarned} XP!`,
      timestamp: Date.now()
    }]);

    setQuizCompleted(true);
  };

  const handleVoiceInput = () => {
    // Simulate voice input
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-violet-600 text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-bounce';
    toast.innerText = '🎙️ Voice recognized → starting random quiz';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
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
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] z-50 border-2 border-white/20"
        >
          <BrainCircuit className="text-white w-8 h-8 animate-pulse" />
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
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">NEURO AI</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setMode('Assistant')}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${mode === 'Assistant' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-gray-400'}`}
                    >
                      Assistant
                    </button>
                    <button 
                      onClick={() => setMode('Tutor')}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${mode === 'Tutor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400'}`}
                    >
                      Tutor
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-800 rounded-full text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Quick Action Chips (Tutor Mode) */}
            {mode === 'Tutor' && !activeQuiz && (
              <div className="flex overflow-x-auto p-4 gap-2 border-b border-slate-800/50 hide-scrollbar">
                <button 
                  onClick={() => handleSend('Start a random quiz')}
                  className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 text-violet-400 rounded-full text-sm font-medium border border-violet-500/30 transition-colors"
                >
                  ✨ Random Quiz
                </button>
                {currentUser.subjects.map(sub => (
                  <button 
                    key={sub.id}
                    onClick={() => handleSend(`Quiz on ${sub.name}`)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-full text-sm font-medium border border-slate-700 transition-colors"
                  >
                    Quiz on {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-violet-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-gray-200 rounded-bl-none border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Active Quiz UI */}
              {activeQuiz && !quizCompleted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800/80 border border-violet-500/30 rounded-2xl p-6 max-w-2xl mx-auto w-full shadow-2xl shadow-violet-900/20"
                >
                  <div className="flex justify-between text-sm text-violet-400 mb-4 font-medium">
                    <span>Question {currentQuestionIndex + 1} of {activeQuiz.length}</span>
                    <span>Score: {quizScore}</span>
                  </div>
                  
                  <h4 className="text-xl text-white font-bold mb-6">{activeQuiz[currentQuestionIndex].text}</h4>
                  
                  <div className="space-y-3">
                    {activeQuiz[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === activeQuiz[currentQuestionIndex].correctAnswerIndex;
                      
                      let btnClass = "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ";
                      let animationProps: any = {};
                      
                      if (!showExplanation) {
                        btnClass += "bg-slate-900 border-slate-700 hover:border-violet-500 hover:bg-slate-800 text-gray-300";
                      } else {
                        if (isCorrect) {
                          btnClass += "bg-green-900/30 border-green-500 text-green-300";
                          if (isSelected) {
                            animationProps = { animate: { scale: [1, 1.03, 1] }, transition: { duration: 0.3 } };
                          } else {
                            animationProps = { 
                              animate: { opacity: [0.5, 1, 0.5], boxShadow: ["0px 0px 0px rgba(34,197,94,0)", "0px 0px 15px rgba(34,197,94,0.4)", "0px 0px 0px rgba(34,197,94,0)"] }, 
                              transition: { repeat: Infinity, duration: 1.5 } 
                            };
                          }
                        } else if (isSelected) {
                          btnClass += "bg-red-900/30 border-red-500 text-red-300";
                          animationProps = { animate: { x: [-8, 8, -8, 8, 0] }, transition: { duration: 0.4 } };
                        } else {
                          btnClass += "bg-slate-900 border-slate-800 text-gray-500 opacity-50";
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
                            <span className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-sm">
                              {['A', 'B', 'C', 'D'][idx]}
                            </span>
                            {option}
                          </span>
                          {showExplanation && isCorrect && <CheckCircle2 className="text-green-500" />}
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
                      <div className={`p-4 rounded-xl mb-4 border ${selectedOption === activeQuiz[currentQuestionIndex].correctAnswerIndex ? 'bg-green-500/20 border-green-500/50 text-green-100' : 'bg-red-500/20 border-red-500/50 text-red-100'}`}>
                        <div className="flex items-center gap-2 font-bold mb-2 text-lg">
                          {selectedOption === activeQuiz[currentQuestionIndex].correctAnswerIndex ? (
                            <><CheckCircle2 className="text-green-400" /> <span className="text-green-400">Correct!</span></>
                          ) : (
                            <><XCircle className="text-red-400" /> <span className="text-red-400">Incorrect</span></>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed opacity-90">{activeQuiz[currentQuestionIndex].explanation}</p>
                      </div>
                      <button 
                        onClick={handleNextQuestion}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-colors"
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
                  className="bg-slate-800/80 border border-violet-500/30 rounded-2xl p-8 max-w-2xl mx-auto w-full shadow-2xl shadow-violet-900/20 text-center"
                >
                  <div className="w-20 h-20 mx-auto bg-violet-600/20 rounded-full flex items-center justify-center mb-6">
                    <Award className="text-violet-400 w-10 h-10" />
                  </div>
                  <h4 className="text-3xl text-white font-bold mb-2">Quiz Complete!</h4>
                  <p className="text-gray-400 mb-8 text-lg">
                    You scored <span className="text-white font-bold">{Math.round((quizScore / activeQuiz.length) * 100)}%</span> and earned <span className="text-violet-400 font-bold">{quizScore * 60} XP</span>.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => startQuiz(quizSubject)}
                      className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={20} /> Retry Quiz
                    </button>
                    <button 
                      onClick={() => { setActiveQuiz(null); setQuizCompleted(false); }}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
                    >
                      Back to Chat
                    </button>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <button 
                  type="button"
                  onClick={handleVoiceInput}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-violet-400 rounded-full transition-colors"
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeQuiz ? "Finish the quiz to chat..." : "Type a message or ask for a quiz..."}
                  disabled={activeQuiz !== null}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-6 py-3 text-white focus:outline-none focus:border-violet-500 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || activeQuiz !== null}
                  className="p-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-gray-600 text-white rounded-full transition-colors"
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
