'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import queueService from '@/services/queueService';

export default function QueueStatusPage() {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      queueService.getQueueStatusById(params.id)
        .then(data => {
          setQueueStatus(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!queueStatus) return <div>Queue Status not found</div>;

  const handleDelete = async () => {
    await queueService.deleteQueueStatus(params.id);
    router.push('/queue/statuses');
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Queue Status Details</h1>
        <div>
          <button
            onClick={() => router.push(`/queue/statuses/${params.id}/edit`)}
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
        <p><strong>Name:</strong> {queueStatus.name}</p>
        <p><strong>Created At:</strong> {new Date(queueStatus.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(queueStatus.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
