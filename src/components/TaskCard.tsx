
import React from 'react';
import { Task, useTaskContext } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Clock, User, Award } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate(`/edit-task/${task.id}`);
  };

  const getAssigneeLabel = (assignee: string) => {
    switch (assignee) {
      case 'A': return 'Person A';
      case 'B': return 'Person B';
      case 'Both': return 'Both';
      default: return assignee;
    }
  };
  
  const getFrequencyLabel = () => {
    if (task.frequency === 'Custom' && task.customFrequency) {
      return task.customFrequency;
    }
    return task.frequency;
  };

  return (
    <Card className={cn(
      "glass-card overflow-hidden w-full mb-3 transition-all",
      "animate-scale-in group hover:shadow-md",
      task.completed ? "opacity-75" : "opacity-100"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => toggleComplete(task.id)}
              className="mt-1"
            />
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "font-medium text-lg transition-all",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 bg-primary/10 text-primary ml-2"
                >
                  <Award size={12} />
                  {task.points || 1} {task.points === 1 ? 'point' : 'points'}
                </Badge>
              </div>
              
              {task.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 bg-white/50"
                >
                  <User size={12} />
                  {getAssigneeLabel(task.assignedTo)}
                </Badge>
                
                <Badge 
                  variant="outline"
                  className="flex items-center gap-1 bg-white/50"
                >
                  <Clock size={12} />
                  {getFrequencyLabel()}
                </Badge>
                
                {task.dueDate && (
                  <Badge className="bg-accent text-accent-foreground">
                    Due {format(new Date(task.dueDate), 'MMM d')}
                  </Badge>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-ring">
                <MoreHorizontal className="text-muted-foreground h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect">
                <DropdownMenuItem onClick={handleEdit}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
