/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './lib/store';
import { Hero } from './components/Hero';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Chatbot } from './components/Chatbot';

const MainApp: React.FC = () => {
  const { currentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30">
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
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
