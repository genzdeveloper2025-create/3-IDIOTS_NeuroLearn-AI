export interface Subject {
  id: string;
  name: string;
  progress: number; // 0-100
  targetHours: number;
  completedHours: number;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  healthScore: number; // 0-100
  focusLevel: number; // 0-100
  burnoutRisk: 'Low' | 'Medium' | 'High';
  subjects: Subject[];
  lastQuizScore?: number;
  lastQuizSubject?: string;
  studyStreak: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  isQuiz?: boolean;
}
