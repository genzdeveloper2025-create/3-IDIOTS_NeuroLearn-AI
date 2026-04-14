import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Subject } from '../types';
import { auth, db, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc, setDoc, updateDoc } from '../firebase';

const defaultSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', progress: 65, targetHours: 40, completedHours: 26, color: '#3b82f6' },
  { id: '2', name: 'Data Structures', progress: 40, targetHours: 50, completedHours: 20, color: '#8b5cf6' },
  { id: '3', name: 'Machine Learning', progress: 80, targetHours: 60, completedHours: 48, color: '#ec4899' },
  { id: '4', name: 'Physics', progress: 25, targetHours: 30, completedHours: 7.5, color: '#10b981' },
];

const generateMockHistory = () => {
  const history = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Random hours between 0 and 4
    const hours = Math.random() > 0.3 ? Math.random() * 4 : 0;
    history.push({
      date: d.toISOString().split('T')[0],
      hours: Number(hours.toFixed(1))
    });
  }
  return history;
};

export const demoUsers: User[] = [
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
    studyHistory: generateMockHistory(),
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
    studyHistory: generateMockHistory(),
  },
  {
    id: 'u3',
    name: 'Priya Sharma',
    email: 'priya@neurolearn.ai',
    xp: 3200,
    level: 15,
    healthScore: 75,
    focusLevel: 80,
    burnoutRisk: 'Medium',
    subjects: [
      { id: '1', name: 'Neuroscience', progress: 70, targetHours: 60, completedHours: 42, color: '#06b6d4' },
      { id: '2', name: 'Cognitive Psychology', progress: 45, targetHours: 40, completedHours: 18, color: '#8b5cf6' },
      { id: '3', name: 'Bioinformatics', progress: 20, targetHours: 50, completedHours: 10, color: '#10b981' }
    ],
    studyStreak: 7,
    studyHistory: generateMockHistory(),
  }
];

interface AppContextType {
  currentUser: User | null;
  loginAsDemo: (userId: string) => void;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  isAuthReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isDemoRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        isDemoRef.current = false;
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            // Create new user
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Student',
              email: firebaseUser.email || '',
              xp: 0,
              level: 1,
              healthScore: 100,
              focusLevel: 100,
              burnoutRisk: 'Low',
              subjects: [...defaultSubjects],
              studyStreak: 1,
            };
            await setDoc(userDocRef, newUser);
            setCurrentUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        if (!isDemoRef.current) {
          setCurrentUser(null);
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginAsDemo = async (userId: string) => {
    await signOut(auth); // Ensure firebase is signed out
    const user = demoUsers.find(u => u.id === userId);
    if (user) {
      isDemoRef.current = true;
      setCurrentUser(user);
    }
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to sign in with Google.");
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Email login failed:", error);
      alert(error.message || "Failed to sign in with email.");
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // The onAuthStateChanged listener will handle creating the user document,
      // but we need to ensure the name is passed. We'll update the document here if needed,
      // or let the listener create it with a default name and update it here.
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const newUser: User = {
        id: userCredential.user.uid,
        name: name || 'Student',
        email: email,
        xp: 0,
        level: 1,
        healthScore: 100,
        focusLevel: 100,
        burnoutRisk: 'Low',
        subjects: [...defaultSubjects],
        studyStreak: 1,
      };
      await setDoc(userDocRef, newUser);
      setCurrentUser(newUser);
    } catch (error: any) {
      console.error("Email signup failed:", error);
      alert(error.message || "Failed to sign up with email.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      isDemoRef.current = false;
      setCurrentUser(null);
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser); // Optimistic update
      
      if (!isDemoRef.current) {
        try {
          const userDocRef = doc(db, 'users', currentUser.id);
          await updateDoc(userDocRef, updates);
        } catch (error) {
          console.error("Error updating user:", error);
          // Revert on failure could be handled here
        }
      }
    }
  };

  const addXP = async (amount: number) => {
    if (currentUser) {
      const newXP = currentUser.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      await updateUser({ xp: newXP, level: newLevel });
    }
  };

  return (
    <AppContext.Provider value={{ currentUser, login, loginWithEmail, signupWithEmail, loginAsDemo, logout, updateUser, addXP, isAuthReady }}>
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
