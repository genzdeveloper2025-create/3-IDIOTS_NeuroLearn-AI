import React, { useState } from 'react';
import { useAppContext, demoUsers } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';

export const Auth: React.FC = () => {
  const { login, loginAsDemo, isAuthReady } = useAppContext();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleLogin = async (id: string, isGoogle: boolean = false) => {
    setLoadingId(id);
    // Simulate a brief loading state for the animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isGoogle) {
      await login();
    } else {
      loginAsDemo(id);
    }
    setLoadingId(null);
  };

  return (
    <div id="auth-section" className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Gaming Vibe: Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>
      
      {/* Background animated neural network particles & Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-950">
        {/* Perspective Grid */}
        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              transformOrigin: 'bottom',
              transform: 'rotateX(60deg) scale(2)',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '0px 50px']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Grid fade out gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-950/80 to-slate-950"></div>
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              boxShadow: '0 0 10px 2px rgba(6, 182, 212, 0.5)'
            }}
            animate={{
              y: [0, Math.random() * -150 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
              scale: [0, Math.random() * 2 + 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 w-full max-w-lg p-6 md:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative flex flex-col max-h-[90vh]"
      >
        {/* Subtle header glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="shrink-0">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-2 tracking-tight uppercase glitch-text" data-text={authMode === 'signin' ? "Student Portal" : "Join NeuroLearn"}>
            {authMode === 'signin' ? "Student Portal" : "Join NeuroLearn"}
          </h2>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            {authMode === 'signin' ? "Sign in to access your adaptive learning dashboard." : "Create an account to start your learning journey."}
          </p>
          
          {/* Auth Mode Toggle */}
          <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-slate-700/50">
            <button 
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'signin' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>
          
          {!isAuthReady ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLogin('google', true)}
              className="w-full py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-cyan-500/30 text-white rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 text-base relative overflow-hidden group"
            >
              {/* Gaming Vibe: Hover sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              
              {loadingId === 'google' ? (
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {authMode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                </>
              )}
            </motion.button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 relative flex-1 min-h-0 flex flex-col">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900/80 px-4 text-[10px] md:text-xs text-cyan-400/80 uppercase tracking-wider font-bold backdrop-blur-md whitespace-nowrap border border-slate-800 rounded-full">
            Or jump in instantly with a Demo
          </div>
          
          <div className="space-y-3 mt-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {demoUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2, boxShadow: "0 5px 15px -5px rgba(6, 182, 212, 0.3)", borderColor: "rgba(6, 182, 212, 0.5)" }}
                className="group relative w-full flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleLogin(user.id)}
              >
                <div className="flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`} alt={user.name} className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold text-sm md:text-base group-hover:text-cyan-400 transition-colors">{user.name}</span>
                    <span className="text-xs text-gray-400 hidden md:block">{user.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 z-10">
                   <span className="text-[10px] md:text-xs font-bold px-2 py-1 bg-slate-900/80 border border-slate-700 rounded-full text-cyan-300 shadow-inner">Lvl {user.level}</span>
                   
                   <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden group-hover:flex items-center justify-center px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors"
                      style={{ opacity: 1, x: 0 }}
                   >
                     {loadingId === user.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                     ) : (
                        `Play`
                     )}
                   </motion.button>
                </div>
                
                {/* Ripple effect container */}
                {loadingId === user.id && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cyan-500/20 rounded-xl pointer-events-none"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
