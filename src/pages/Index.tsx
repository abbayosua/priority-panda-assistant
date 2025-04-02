
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, PlusCircle, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import PomodoroTimer from '@/components/tasks/PomodoroTimer';
import TaskCard from '@/components/tasks/TaskCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import TaskForm from '@/components/tasks/TaskForm';
import { Task } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const { tasks, user, prioritizeTasks } = useApp();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedToday = tasks.filter(task => {
    if (!task.completed) return false;
    const today = new Date();
    const updatedDate = new Date(task.updatedAt);
    
    return updatedDate.getDate() === today.getDate() && 
           updatedDate.getMonth() === today.getMonth() && 
           updatedDate.getFullYear() === today.getFullYear();
  });

  const upcomingTasks = incompleteTasks
    .filter(task => task.deadline)
    .sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    })
    .slice(0, 3);

  const highPriorityTasks = incompleteTasks
    .filter(task => task.priority <= 2)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  const handleOpenEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Hi, {user?.name || 'there'}! 👋
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 text-primary h-5 w-5" />
                Tasks Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {completedToday.length}/{incompleteTasks.length + completedToday.length}
              </div>
              <p className="text-gray-500">tasks completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 text-primary h-5 w-5" />
                Coming Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {upcomingTasks.length}
              </div>
              <p className="text-gray-500">upcoming tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <PlusCircle className="mr-2 text-primary h-5 w-5" />
                Add Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/add')}
              >
                New Task
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Smart Prioritize</CardTitle>
            <Button 
              onClick={prioritizeTasks}
              className="flex items-center"
            >
              <BrainCircuit className="mr-2 h-4 w-4" />
              Optimize Schedule
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Let AI optimize your tasks based on deadlines, priority, and time available.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">High Priority</h2>
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleOpenEditDialog} />
              ))
            ) : (
              <p className="text-gray-500">No high priority tasks.</p>
            )}
            {highPriorityTasks.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/tasks')}
              >
                View All Tasks
              </Button>
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold">Focus Timer</h2>
            <PomodoroTimer 
              taskTitle={highPriorityTasks.length > 0 ? highPriorityTasks[0].title : undefined} 
            />
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <TaskForm 
            existingTask={editingTask || undefined} 
            onSuccess={handleCloseDialog} 
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Index;
