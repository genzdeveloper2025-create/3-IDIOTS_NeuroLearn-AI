import React, { useState } from 'react';
import { useAppContext, demoUsers } from '../lib/store';
import { motion, AnimatePresence } from 'motion/react';

export const Auth: React.FC = () => {
  const { login, loginWithEmail, signupWithEmail, loginAsDemo, isAuthReady } = useAppContext();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId('email');
    try {
      if (authMode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name);
      }
    } catch (error) {
      // Error is handled in store
    } finally {
      setLoadingId(null);
    }
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

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 w-full max-w-lg p-6 md:p-8 hud-panel rounded-none text-center relative flex flex-col max-h-[90vh]"
      >
        <div className="hud-bracket-tl"></div>
        <div className="hud-bracket-tr"></div>
        <div className="hud-bracket-bl"></div>
        <div className="hud-bracket-br"></div>
        {/* Subtle header glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="shrink-0">
          <h2 className="text-3xl font-mono font-bold text-cyan-400 mb-2 tracking-widest uppercase neon-text glitch-text" data-text={authMode === 'signin' ? "SYSTEM LOGIN" : "INITIALIZE USER"}>
            {authMode === 'signin' ? "SYSTEM LOGIN" : "INITIALIZE USER"}
          </h2>
          <p className="text-cyan-600 mb-6 text-xs font-mono uppercase tracking-widest">
            {authMode === 'signin' ? "AUTHENTICATE TO ACCESS NEURAL DASHBOARD." : "CREATE PROFILE TO BEGIN UPLINK."}
          </p>
          
          {/* Auth Mode Toggle */}
          <div className="flex bg-slate-950 border border-cyan-900/50 p-1 mb-6">
            <button 
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest transition-all border ${authMode === 'signin' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'border-transparent text-cyan-700 hover:text-cyan-500'}`}
            >
              AUTHENTICATE
            </button>
            <button 
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest transition-all border ${authMode === 'signup' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'border-transparent text-cyan-700 hover:text-cyan-500'}`}
            >
              REGISTER
            </button>
          </div>
          
          {!isAuthReady ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 border-r-2 border-r-transparent"></div>
            </div>
          ) : (
            <>
              <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                {authMode === 'signup' && (
                  <input
                    type="text"
                    placeholder="DESIGNATION (NAME)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-cyan-800 px-4 py-3 text-cyan-100 font-mono text-sm placeholder:text-cyan-800 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all uppercase"
                  />
                )}
                <input
                  type="email"
                  placeholder="COMM LINK (EMAIL)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-cyan-800 px-4 py-3 text-cyan-100 font-mono text-sm placeholder:text-cyan-800 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all uppercase"
                />
                <input
                  type="password"
                  placeholder="SECURITY KEY (PASSWORD)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-cyan-800 px-4 py-3 text-cyan-100 font-mono text-sm placeholder:text-cyan-800 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all uppercase"
                />
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,240,255,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loadingId !== null}
                  className="w-full py-3.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-400 font-mono text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  {loadingId === 'email' ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-cyan-400 border-r-2 border-r-transparent"></div>
                  ) : (
                    authMode === 'signin' ? 'INITIATE LOGIN' : 'EXECUTE REGISTRATION'
                  )}
                </motion.button>
              </form>

              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-cyan-900/50"></div>
                <span className="flex-shrink-0 mx-4 text-cyan-700 text-[10px] font-mono uppercase tracking-widest">EXTERNAL PROTOCOLS</span>
                <div className="flex-grow border-t border-cyan-900/50"></div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,240,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLogin('google', true)}
                disabled={loadingId !== null}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-cyan-800 text-cyan-400 font-mono text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {loadingId === 'google' ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-cyan-400 border-r-2 border-r-transparent"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 fill-cyan-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </>
                )}
              </motion.button>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-cyan-900/50 relative flex-1 min-h-0 flex flex-col">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-4 text-[10px] text-cyan-600 uppercase tracking-widest font-mono whitespace-nowrap border border-cyan-900/50">
            QUICK ACCESS PROTOCOLS
          </div>
          
          <div className="space-y-3 mt-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {demoUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5, boxShadow: "0 0 15px rgba(0,240,255,0.2)", borderColor: "rgba(0,240,255,0.5)" }}
                className="group relative w-full flex items-center justify-between p-3 bg-cyan-950/20 border border-cyan-900 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleLogin(user.id)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-900 group-hover:bg-cyan-400 transition-colors"></div>
                <div className="flex items-center gap-3 z-10 pl-2">
                  <div className="w-10 h-10 border border-cyan-500/50 flex items-center justify-center relative">
                    <div className="absolute inset-0 border-[1px] border-cyan-500/30 animate-spin-slow"></div>
                    <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`} alt={user.name} className="w-8 h-8 opacity-80 mix-blend-screen grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-cyan-100 font-mono font-bold text-sm uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{user.name}</span>
                    <span className="text-[10px] text-cyan-700 font-mono uppercase hidden md:block">{user.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 z-10">
                   <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 bg-cyan-950/80 border border-cyan-800 text-cyan-500">LVL {user.level}</span>
                   
                   <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden group-hover:flex items-center justify-center px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-400 text-[10px] font-mono uppercase tracking-widest transition-colors"
                      style={{ opacity: 1, x: 0 }}
                   >
                     {loadingId === user.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-cyan-400 border-r-2 border-r-transparent"></div>
                     ) : (
                        `EXECUTE`
                     )}
                   </motion.button>
                </div>
                
                {/* Ripple effect container */}
                {loadingId === user.id && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-cyan-500/20 pointer-events-none"
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
