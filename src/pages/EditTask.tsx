
import React from 'react';
import TaskForm from '@/components/TaskForm';
import Layout from '@/components/Layout';

const EditTask = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium mb-6">Edit Task</h2>
        <TaskForm />
      </div>
    </Layout>
  );
};

export default EditTask;
