
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useApp();
  
  const priorityColors: Record<number, string> = {
    1: 'bg-priority-1 border-priority-1', // Highest
    2: 'bg-priority-2 border-priority-2',
    3: 'bg-priority-3 border-priority-3',
    4: 'bg-priority-4 border-priority-4',
    5: 'bg-priority-5 border-priority-5', // Lowest
  };
  
  const priorityLabels: Record<number, string> = {
    1: 'Highest',
    2: 'High',
    3: 'Medium',
    4: 'Low',
    5: 'Lowest',
  };
  
  const handleToggleCompleted = () => {
    updateTask({
      ...task,
      completed: !task.completed
    });
  };

  return (
    <Card className={cn(
      "w-full my-2 transition-all",
      task.completed ? "opacity-50" : ""
    )}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex-shrink-0">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleToggleCompleted}
            className={cn("rounded-full", task.completed && "bg-primary")}
          />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className={cn(
            "font-medium text-lg truncate",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 truncate">{task.description}</p>
          )}
        </div>
        <Badge 
          className={cn(
            "ml-auto border-2 text-white rounded-full",
            priorityColors[task.priority]
          )}
        >
          {priorityLabels[task.priority]}
        </Badge>
      </CardHeader>
      
      <CardContent>
        {task.deadline && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Due: {format(new Date(task.deadline), 'MMM d, yyyy')}</span>
          </div>
        )}
        
        {task.scheduledTime && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Clock className="h-4 w-4 mr-2" />
            <span>Scheduled: {format(new Date(task.scheduledTime.start), 'h:mm a')} - {format(new Date(task.scheduledTime.end), 'h:mm a')}</span>
          </div>
        )}
        
        {task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Tag className="h-4 w-4 text-gray-500" />
            {task.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-destructive"
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
