'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import queueService from '@/services/queueService';

export default function ServiceCounterPage() {
  const [serviceCounter, setServiceCounter] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      queueService.getServiceCounterById(params.id)
        .then(data => {
          setServiceCounter(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!serviceCounter) return <div>Service Counter not found</div>;

  const handleDelete = async () => {
    await queueService.deleteServiceCounter(params.id);
    router.push('/queue/service-counters');
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Service Counter Details</h1>
        <div>
          <button
            onClick={() => router.push(`/queue/service-counters/${params.id}/edit`)}
            className="bg-hospital-accent text-hospital-white px-4 py-2 rounded-md mr-2 hover:bg-hospital-accent-dark"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-hospital-error text-hospital-white px-4 py-2 rounded-md hover:bg-hospital-critical"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="bg-hospital-white p-6 rounded-md shadow-md">
        <p><strong>Name:</strong> {serviceCounter.name}</p>
        <p><strong>Department:</strong> {serviceCounter.department.name}</p>
        <p><strong>Created At:</strong> {new Date(serviceCounter.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(serviceCounter.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
