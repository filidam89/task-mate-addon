
import React, { useState } from 'react';
import { Task, useTaskContext } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import PersonFilter from '@/components/PersonFilter';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  const { tasks, filterByPerson } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter tasks based on the selected person
  const filteredByPerson = tasks.filter(task => {
    if (filterByPerson === 'All') return true;
    return task.assignedTo === filterByPerson;
  });
  
  // Further filter by search term
  const filteredTasks = filteredByPerson.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Separate completed and active tasks
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-effect focus-ring"
          />
        </div>
        
        <PersonFilter />
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-effect">
            <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4 space-y-4">
            {activeTasks.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No active tasks found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No completed tasks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
