
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const { tasks, prioritizeTasks } = useApp();
  const navigate = useNavigate();

  const scheduledTasks = tasks
    .filter(task => !task.completed && task.scheduledTime)
    .sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) {
        return new Date(a.scheduledTime.start).getTime() - new Date(b.scheduledTime.start).getTime();
      }
      return 0;
    });

  const unscheduledTasks = tasks
    .filter(task => !task.completed && !task.scheduledTime)
    .sort((a, b) => a.priority - b.priority);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForHour = (hour: number) => {
    return scheduledTasks.filter(task => {
      if (!task.scheduledTime) return false;
      return new Date(task.scheduledTime.start).getHours() === hour;
    });
  };

  const priorityColors: Record<number, string> = {
    1: 'bg-priority-1 border-priority-1', // Highest
    2: 'bg-priority-2 border-priority-2',
    3: 'bg-priority-3 border-priority-3',
    4: 'bg-priority-4 border-priority-4',
    5: 'bg-priority-5 border-priority-5', // Lowest
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Today's Schedule</h1>
          
          <Button 
            onClick={prioritizeTasks}
            className="flex items-center"
          >
            <BrainCircuit className="mr-2 h-4 w-4" />
            Optimize
          </Button>
        </div>

        {scheduledTasks.length === 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle>No Scheduled Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                You don't have any scheduled tasks yet. Click the "Optimize" button to let AI create a schedule for you.
              </p>
              
              {unscheduledTasks.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Unscheduled Tasks ({unscheduledTasks.length})</h3>
                  <div className="space-y-2">
                    {unscheduledTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="truncate">{task.title}</span>
                        <Badge 
                          className={cn(
                            "ml-2 text-white text-xs",
                            priorityColors[task.priority]
                          )}
                        >
                          P{task.priority}
                        </Badge>
                      </div>
                    ))}
                    
                    {unscheduledTasks.length > 3 && (
                      <Button 
                        variant="ghost" 
                        className="w-full text-sm"
                        onClick={() => navigate('/tasks')}
                      >
                        View {unscheduledTasks.length - 3} more tasks
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2 pr-4">
              {hours.map(hour => {
                const tasksInHour = getTasksForHour(hour);
                if (tasksInHour.length === 0) return null;
                
                return (
                  <div key={hour} className="flex">
                    <div className="w-16 py-2 text-right pr-4 text-gray-500 font-medium">
                      {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                    </div>
                    
                    <div className="flex-1 border-l pl-4 pb-6">
                      {tasksInHour.map(task => (
                        <Card key={task.id} className="mb-2">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{task.title}</h3>
                                {task.scheduledTime && (
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(task.scheduledTime.start), 'h:mm a')} - {format(new Date(task.scheduledTime.end), 'h:mm a')}
                                  </p>
                                )}
                              </div>
                              <Badge 
                                className={cn(
                                  "ml-2 text-white",
                                  priorityColors[task.priority]
                                )}
                              >
                                P{task.priority}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {unscheduledTasks.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold mb-2">Unscheduled Tasks</h2>
                  <div className="space-y-2">
                    {unscheduledTasks.map(task => (
                      <Card key={task.id}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span>{task.title}</span>
                            <Badge 
                              className={cn(
                                "ml-2 text-white",
                                priorityColors[task.priority]
                              )}
                            >
                              P{task.priority}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </AppLayout>
  );
};

export default Schedule;
