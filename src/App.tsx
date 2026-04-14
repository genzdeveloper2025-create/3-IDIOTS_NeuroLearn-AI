/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './lib/store';
import { Hero } from './components/Hero';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';
import { motion, AnimatePresence } from 'motion/react';

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "INITIALIZING CORE PROTOCOLS...",
    "ESTABLISHING SECURE DATALINK...",
    "CALIBRATING NEURAL INTERFACE...",
    "SYSTEM ONLINE."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStep(currentStep);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center font-mono text-cyan-400">
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-32 h-32 border-4 border-cyan-500/30 rounded-full flex items-center justify-center mb-8 relative"
      >
        <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-2 border-b-4 border-blue-500 rounded-full animate-spin-slow-reverse"></div>
        <div className="w-16 h-16 bg-cyan-500/20 rounded-full animate-pulse"></div>
      </motion.div>
      <div className="text-xl tracking-widest neon-text h-8">
        {steps[step]}
      </div>
      <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-cyan-400"
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

const GlobalHUD = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <div className="scanline"></div>
      <div className="absolute inset-0 crt-grid opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
      
      {/* Cursor Glow */}
      <motion.div 
        className="absolute w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 0.5 }}
      />
      
      {/* Corner HUD Elements */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-500/50">SYS.VER.4.2.9<br/>DATALINK: SECURE</div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-cyan-500/50 text-right">MEM: 4096TB<br/>NET: UPLINK</div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-cyan-500/50">COORD: {Math.round(mousePos.x)} : {Math.round(mousePos.y)}</div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-cyan-500/50 text-right">STATUS: OPTIMAL</div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { currentUser } = useAppContext();
  const [booted, setBooted] = useState(false);

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      <GlobalHUD />
      <div className="relative z-10 h-screen overflow-y-auto custom-scrollbar">
        {!currentUser ? (
          <>
            <Hero />
            <Auth />
          </>
        ) : (
          <>
            <Dashboard />
            <Chatbot />
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
