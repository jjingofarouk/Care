'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalTask, updateClinicalTask } from '@/services/clinicalService';

export default function ClinicalTaskEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getClinicalTask(params.id);
        setFormData({
          description: data.description,
          status: data.status,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical task:', error);
        setLoading(false);
      }
    }
    fetchTask();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClinicalTask(params.id, formData);
      router.push('/clinical/tasks');
    } catch (error) {
      console.error('Error updating clinical task:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Clinical Task</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
            rows="5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Status</label>
          <input
            type="text"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-hospital-accent text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/clinical/tasks')}
            className="bg-hospital-gray-200 text-hospital-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
