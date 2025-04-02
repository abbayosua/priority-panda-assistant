
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Task, ApiKeys } from '../types';
import { useToast } from '@/components/ui/use-toast';

type AppContextType = {
  user: User | null;
  tasks: Task[];
  isLoading: boolean;
  apiKeys: ApiKeys;
  setUser: (user: User | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  setApiKeys: (keys: ApiKeys) => void;
  prioritizeTasks: () => void;
};

const defaultApiKeys: ApiKeys = {
  gemini: localStorage.getItem('geminiApiKey') || '',
  firebase: localStorage.getItem('firebaseConfig') ? 
    JSON.parse(localStorage.getItem('firebaseConfig') || '{}') : 
    null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeys, setApiKeysState] = useState<ApiKeys>(defaultApiKeys);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a user in localStorage (for guest mode)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load tasks from localStorage if not using Firebase
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          deadline: task.deadline ? new Date(task.deadline) : null,
          scheduledTime: task.scheduledTime ? {
            start: new Date(task.scheduledTime.start),
            end: new Date(task.scheduledTime.end)
          } : null
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        setTasks([]);
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (!apiKeys.firebase && tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, apiKeys.firebase]);

  const setApiKeys = (keys: ApiKeys) => {
    localStorage.setItem('geminiApiKey', keys.gemini);
    if (keys.firebase) {
      localStorage.setItem('firebaseConfig', JSON.stringify(keys.firebase));
    }
    setApiKeysState(keys);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast({
      title: 'Task added',
      description: 'Your task has been added successfully.',
    });
  };

  const updateTask = (updatedTask: Task) => {
    updatedTask.updatedAt = new Date();
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    toast({
      title: 'Task updated',
      description: 'Your task has been updated successfully.',
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    
    toast({
      title: 'Task deleted',
      description: 'Your task has been removed.',
      variant: 'destructive',
    });
  };

  const prioritizeTasks = async () => {
    if (!apiKeys.gemini) {
      toast({
        title: 'API key required',
        description: 'Please set up your Gemini API key in settings.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // In real implementation, we would call Gemini API here
      // For now, we'll simulate a response by sorting tasks by deadline and priority
      
      setTimeout(() => {
        const incompleteTasks = tasks.filter(task => !task.completed);
        const sortedTasks = [...incompleteTasks].sort((a, b) => {
          // First sort by priority (1 is highest)
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          
          // Then by deadline
          if (a.deadline && b.deadline) {
            return a.deadline.getTime() - b.deadline.getTime();
          }
          if (a.deadline) return -1;
          if (b.deadline) return 1;
          
          return 0;
        });
        
        // Simulate AI scheduling by assigning time blocks
        const workStartHour = 9; // 9 AM
        const currentDate = new Date();
        const today = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        
        const scheduledTasks = sortedTasks.map((task, index) => {
          const startTime = new Date(today);
          startTime.setHours(workStartHour + index, 0, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + 1); // 1 hour blocks
          
          return {
            ...task,
            scheduledTime: {
              start: startTime,
              end: endTime
            }
          };
        });
        
        // Update tasks with schedules
        setTasks(prev => {
          const updatedTasks = prev.map(task => {
            const scheduledTask = scheduledTasks.find(t => t.id === task.id);
            if (scheduledTask) {
              return scheduledTask;
            }
            return task;
          });
          return updatedTasks;
        });
        
        toast({
          title: 'Tasks prioritized',
          description: 'Your schedule has been optimized based on priorities and deadlines.',
        });
        
        setIsLoading(false);
      }, 1500); // Simulate API delay
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to prioritize tasks. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const contextValue: AppContextType = {
    user,
    tasks,
    isLoading,
    apiKeys,
    setUser,
    addTask,
    updateTask,
    deleteTask,
    setApiKeys,
    prioritizeTasks
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
