import React from 'react';
import { useAppContext, demoUsers } from '../lib/store';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const { login, loginAsDemo, isAuthReady } = useAppContext();

  return (
    <div id="auth-section" className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Student Portal</h2>
        <p className="text-gray-400 mb-8">Sign in to access your adaptive learning dashboard.</p>
        
        {!isAuthReady ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <button
            onClick={login}
            className="w-full py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-sm text-gray-400 mb-4 text-center">Or try a Demo Account:</p>
          <div className="space-y-3">
            {demoUsers.map(user => (
              <button
                key={user.id}
                onClick={() => loginAsDemo(user.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/30 hover:bg-slate-800/80 border border-slate-700/50 rounded-lg transition-colors group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium group-hover:text-violet-400 transition-colors">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-gray-300">Level {user.level}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
