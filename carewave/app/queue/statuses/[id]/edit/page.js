'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import queueService from '@/services/queueService';

export default function EditQueueStatusPage() {
  const [formData, setFormData] = useState({
    name: '',
  });
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    queueService.getQueueStatusById(params.id)
      .then(data => {
        setFormData({ name: data.name });
      });
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await queueService.updateQueueStatus(params.id, formData);
    router.push(`/queue/statuses/${params.id}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <h1 className="text-2xl font-bold text-hospital-gray-900 mb-4">Edit Queue Status</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push(`/queue/statuses/${params.id}`)}
            className="bg-hospital-gray-400 text-hospital-white px-4 py-2 rounded-md mr-2 hover:bg-hospital-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-hospital-accent text-hospital-white px-4 py-2 rounded-md hover:bg-hospital-accent-dark"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
