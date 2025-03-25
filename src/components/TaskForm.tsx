
import React, { useState } from 'react';
import { Task, Frequency, Person, useTaskContext } from '@/contexts/TaskContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedTo: z.enum(['A', 'B', 'Both']),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Custom']),
  customFrequency: z.string().optional(),
  dueDate: z.date(),
  points: z.coerce.number().min(0, 'Points must be a positive number').default(1),
});

type FormValues = z.infer<typeof formSchema>;

const TaskForm: React.FC = () => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const task = isEditMode ? tasks.find(t => t.id === id) : null;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      assignedTo: task?.assignedTo || 'A',
      frequency: task?.frequency || 'Daily',
      customFrequency: task?.customFrequency || '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
      points: task?.points || 1,
    }
  });
  
  const selectedFrequency = form.watch('frequency');
  
  const onSubmit = (data: FormValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo as Person,
        frequency: data.frequency as Frequency,
        customFrequency: data.frequency === 'Custom' ? data.customFrequency : undefined,
        dueDate: data.dueDate.toISOString(),
        completed: task?.completed || false,
        points: data.points,
      };
      
      if (isEditMode && task) {
        updateTask(task.id, taskData);
      } else {
        addTask(taskData);
      }
      
      navigate('/');
    } catch (error) {
      toast.error('Failed to save task');
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter task title" 
                    {...field} 
                    className="glass-effect focus-ring"
                  />
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
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add details" 
                    {...field} 
                    className="glass-effect focus-ring resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="glass-effect focus-ring">
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect">
                      <SelectItem value="A">Person A</SelectItem>
                      <SelectItem value="B">Person B</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="glass-effect focus-ring">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect">
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedFrequency === 'Custom' && (
            <FormField
              control={form.control}
              name="customFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Frequency</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Every 3 days" 
                      {...field} 
                      className="glass-effect focus-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points (1-10)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    placeholder="Points value" 
                    {...field} 
                    className="glass-effect focus-ring"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "glass-effect w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="glass-effect p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/')}
              className="focus-ring"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="focus-ring"
            >
              {isEditMode ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
