
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import TaskCard from '@/components/tasks/TaskCard';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TaskForm from '@/components/tasks/TaskForm';

const Tasks = () => {
  const { tasks } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const completedTasks = tasks.filter(task => task.completed);
  const activeTasks = tasks.filter(task => !task.completed);

  const filteredActive = activeTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCompleted = completedTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>

        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active ({filteredActive.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filteredCompleted.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="space-y-4">
              {filteredActive.length > 0 ? (
                filteredActive
                  .sort((a, b) => {
                    // First by priority
                    if (a.priority !== b.priority) {
                      return a.priority - b.priority;
                    }
                    
                    // Then by deadline
                    if (a.deadline && b.deadline) {
                      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                    }
                    if (a.deadline) return -1;
                    if (b.deadline) return 1;
                    
                    // Finally by creation date
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .map(task => (
                    <TaskCard key={task.id} task={task} onEdit={handleOpenEditDialog} />
                  ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm ? 'No matching tasks found.' : 'No active tasks. Add some!'}
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="space-y-4">
              {filteredCompleted.length > 0 ? (
                filteredCompleted
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map(task => (
                    <TaskCard key={task.id} task={task} onEdit={handleOpenEditDialog} />
                  ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm ? 'No matching tasks found.' : 'No completed tasks yet.'}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
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

export default Tasks;
