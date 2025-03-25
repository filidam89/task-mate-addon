
import React from 'react';
import TaskForm from '@/components/TaskForm';
import Layout from '@/components/Layout';

const AddTask = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium mb-6">Add New Task</h2>
        <TaskForm />
      </div>
    </Layout>
  );
};

export default AddTask;
