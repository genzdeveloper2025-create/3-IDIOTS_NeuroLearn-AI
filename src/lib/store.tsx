import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Subject } from '../types';

const defaultSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', progress: 65, targetHours: 40, completedHours: 26, color: '#3b82f6' },
  { id: '2', name: 'Data Structures', progress: 40, targetHours: 50, completedHours: 20, color: '#8b5cf6' },
  { id: '3', name: 'Machine Learning', progress: 80, targetHours: 60, completedHours: 48, color: '#ec4899' },
  { id: '4', name: 'Physics', progress: 25, targetHours: 30, completedHours: 7.5, color: '#10b981' },
];

const demoUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Mercer',
    email: 'alex@neurolearn.ai',
    xp: 2450,
    level: 12,
    healthScore: 85,
    focusLevel: 92,
    burnoutRisk: 'Low',
    subjects: [...defaultSubjects],
    studyStreak: 14,
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah@neurolearn.ai',
    xp: 4120,
    level: 18,
    healthScore: 60,
    focusLevel: 45,
    burnoutRisk: 'High',
    subjects: [
      { id: '1', name: 'Quantum Computing', progress: 90, targetHours: 100, completedHours: 90, color: '#f59e0b' },
      { id: '2', name: 'Advanced Algorithms', progress: 55, targetHours: 80, completedHours: 44, color: '#ef4444' },
    ],
    studyStreak: 3,
  }
];

interface AppContextType {
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  demoUsers: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('neurolearn_user_id');
    if (storedUserId) {
      const user = demoUsers.find(u => u.id === storedUserId);
      if (user) {
        // Load potentially updated user data from local storage if we wanted full persistence,
        // but for demo, just loading the base demo user is fine, or we can store the whole user object.
        const storedUserData = localStorage.getItem(`neurolearn_user_${storedUserId}`);
        if (storedUserData) {
          setCurrentUser(JSON.parse(storedUserData));
        } else {
          setCurrentUser(user);
        }
      }
    }
  }, []);

  const login = (email: string) => {
    const user = demoUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('neurolearn_user_id', user.id);
      if (!localStorage.getItem(`neurolearn_user_${user.id}`)) {
        localStorage.setItem(`neurolearn_user_${user.id}`, JSON.stringify(user));
      }
    } else {
      alert('User not found. Try alex@neurolearn.ai or sarah@neurolearn.ai');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('neurolearn_user_id');
  };

  const updateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem(`neurolearn_user_${updatedUser.id}`, JSON.stringify(updatedUser));
    }
  };

  const addXP = (amount: number) => {
    if (currentUser) {
      const newXP = currentUser.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1; // Simple level formula
      updateUser({ xp: newXP, level: newLevel });
    }
  };

  return (
    <AppContext.Provider value={{ currentUser, login, logout, updateUser, addXP, demoUsers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
