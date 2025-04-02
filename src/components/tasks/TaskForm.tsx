
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { Popover } from '@/components/ui/popover';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["1", "2", "3", "4", "5"]),
  tags: z.string().optional(),
  deadline: z.date().nullable().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSuccess: () => void;
  existingTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSuccess, existingTask }) => {
  const { addTask, updateTask } = useApp();
  const [date, setDate] = useState<Date | undefined>(
    existingTask?.deadline ? new Date(existingTask.deadline) : undefined
  );
  
  const isEditing = !!existingTask;
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || "",
      description: existingTask?.description || "",
      priority: existingTask?.priority.toString() as "1" | "2" | "3" | "4" | "5" || "3",
      tags: existingTask?.tags.join(", ") || "",
      deadline: existingTask?.deadline || null,
    },
  });

  const onSubmit = (data: TaskFormData) => {
    const tags = data.tags ? 
      data.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "") : 
      [];
    
    if (isEditing && existingTask) {
      updateTask({
        ...existingTask,
        title: data.title,
        description: data.description || "",
        priority: Number(data.priority) as 1 | 2 | 3 | 4 | 5,
        tags,
        deadline: data.deadline,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description || "",
        priority: Number(data.priority) as 1 | 2 | 3 | 4 | 5,
        completed: false,
        tags,
        deadline: data.deadline,
      });
    }
    
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-1"
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <FormItem
                      key={level}
                      className="flex flex-col items-center space-y-1"
                    >
                      <FormControl>
                        <RadioGroupItem 
                          value={level.toString()} 
                          id={`priority-${level}`} 
                          className={cn(
                            "h-8 w-8 rounded-full border-2",
                            level === 1 && "border-priority-1",
                            level === 2 && "border-priority-2",
                            level === 3 && "border-priority-3",
                            level === 4 && "border-priority-4",
                            level === 5 && "border-priority-5",
                          )}
                        />
                      </FormControl>
                      <FormLabel 
                        htmlFor={`priority-${level}`}
                        className="text-xs"
                      >
                        {level === 1 && "Highest"}
                        {level === 2 && "High"}
                        {level === 3 && "Medium"}
                        {level === 4 && "Low"}
                        {level === 5 && "Lowest"}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline (optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={(date) => {
                      field.onChange(date);
                      setDate(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (separate with commas)</FormLabel>
              <FormControl>
                <Input placeholder="work, personal, urgent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
