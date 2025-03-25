
import React, { useState } from 'react';
import { Task, Person, useTaskContext } from '@/contexts/TaskContext';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Clock, User, Award, UserCheck, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person>(task.assignedTo);
  
  const handleEdit = () => {
    navigate(`/edit-task/${task.id}`);
  };

  const handleToggleComplete = () => {
    if (!task.completed) {
      setSelectedPerson(task.assignedTo);
      setIsDialogOpen(true);
    } else {
      // If unchecking, just toggle without confirmation
      toggleComplete(task.id);
    }
  };

  const handleConfirmComplete = () => {
    toggleComplete(task.id, selectedPerson);
    setIsDialogOpen(false);
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
    <>
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
                onCheckedChange={handleToggleComplete}
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
                  
                  {task.completed && task.confirmedBy && (
                    <Badge 
                      variant="outline"
                      className="flex items-center gap-1 bg-green-100 text-green-800"
                    >
                      <UserCheck size={12} />
                      Completed by: {getAssigneeLabel(task.confirmedBy)}
                    </Badge>
                  )}
                  
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

      {/* Dialog for confirming who completed the task */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Who completed this task?</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup value={selectedPerson} onValueChange={(value) => setSelectedPerson(value as Person)} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A" id="r1" />
                <Label htmlFor="r1">Person A</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="B" id="r2" />
                <Label htmlFor="r2">Person B</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Both" id="r3" />
                <Label htmlFor="r3">Both Persons</Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirmComplete}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> 
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
