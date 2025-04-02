
export type User = {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 is highest, 5 is lowest
  deadline?: Date | null;
  completed: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  scheduledTime?: {
    start: Date;
    end: Date;
  } | null;
};

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export type ApiKeys = {
  gemini: string;
  firebase: FirebaseConfig | null;
};
