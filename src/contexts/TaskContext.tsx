
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
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  filterByPerson: Person | 'All';
  setFilterByPerson: (person: Person | 'All') => void;
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        filterByPerson,
        setFilterByPerson
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
