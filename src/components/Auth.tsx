import React, { useState } from 'react';
import { useAppContext } from '../lib/store';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const { login, demoUsers } = useAppContext();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div id="auth-section" className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Student Portal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg transition-all"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-sm text-gray-400 mb-4 text-center">Demo Accounts Available:</p>
          <div className="space-y-3">
            {demoUsers.map(user => (
              <button
                key={user.id}
                onClick={() => login(user.email)}
                className="w-full flex items-center justify-between px-4 py-2 bg-slate-800/30 hover:bg-slate-800/80 border border-slate-700/50 rounded-lg transition-colors group"
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
