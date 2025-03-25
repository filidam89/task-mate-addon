
import React, { useState } from 'react';
import { Task, useTaskContext } from '@/contexts/TaskContext';
import TaskCard from '@/components/TaskCard';
import PersonFilter from '@/components/PersonFilter';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { tasks, filterByPerson, getPointsByPerson } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get point statistics
  const { personA, personB, difference } = getPointsByPerson();
  
  // Determine who's ahead
  const getScoreIcon = () => {
    if (difference > 0) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (difference < 0) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };
  
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
        {/* Points Summary Card */}
        <Card className="glass-card overflow-hidden w-full mb-6 transition-all animate-scale-in">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Points Summary
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Person A</span>
                <span className="text-2xl font-bold">{personA.toFixed(1)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">Difference</span>
                <div className="flex items-center gap-1">
                  {getScoreIcon()}
                  <span className="text-xl font-bold">{Math.abs(difference).toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Person B</span>
                <span className="text-2xl font-bold">{personB.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
