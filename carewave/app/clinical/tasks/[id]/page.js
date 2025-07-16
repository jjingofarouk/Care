'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalTask } from '@/services/clinicalService';

export default function ClinicalTaskView({ params }) {
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getClinicalTask(params.id);
        setTask(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical task:', error);
        setLoading(false);
      }
    }
    fetchTask();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clinical Task</h1>
        <button
          onClick={() => router.push('/clinical/tasks')}
          className="bg-hospital-accent text-white px-4 py-2 rounded"
        >
          Back to Tasks
        </button>
      </div>
      <div className="bg-hospital-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Patient</h2>
          <p>{task.patient.firstName} {task.patient.lastName}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Assigned To</h2>
          <p>{task.assignedToId}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Assigned To Type</h2>
          <p>{task.assignedToType}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Description</h2>
          <p>{task.description}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Status</h2>
          <p>{task.status}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Created At</h2>
          <p>{new Date(task.createdAt).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Updated At</h2>
          <p>{new Date(task.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
