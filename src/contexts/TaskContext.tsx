
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

export type Person = 'A' | 'B' | 'Both';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: Person;
  frequency: Frequency;
  customFrequency?: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  points: number;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  filterByPerson: Person | 'All';
  setFilterByPerson: (person: Person | 'All') => void;
  getPointsByPerson: () => { personA: number, personB: number, difference: number };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filterByPerson, setFilterByPerson] = useState<Person | 'All'>('All');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task added successfully");
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getPointsByPerson = () => {
    const completedTasks = tasks.filter(task => task.completed);
    
    let personAPoints = 0;
    let personBPoints = 0;
    
    completedTasks.forEach(task => {
      if (task.assignedTo === 'A') {
        personAPoints += task.points || 0;
      } else if (task.assignedTo === 'B') {
        personBPoints += task.points || 0;
      } else if (task.assignedTo === 'Both') {
        // Split points for tasks assigned to both
        personAPoints += (task.points || 0) / 2;
        personBPoints += (task.points || 0) / 2;
      }
    });
    
    return {
      personA: personAPoints,
      personB: personBPoints,
      difference: personAPoints - personBPoints
    };
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        filterByPerson,
        setFilterByPerson,
        getPointsByPerson
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
