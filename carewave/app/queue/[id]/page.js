'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import queueService from '@/services/queueService';

export default function QueueEntryPage() {
  const [queueEntry, setQueueEntry] = useState(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      queueService.getById(params.id).then(setQueueEntry);
    }
  }, [params.id]);

  if (!queueEntry) return <div>Loading...</div>;

  const handleDelete = async () => {
    await queueService.delete(params.id);
    router.push('/queue');
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Queue Entry Details</h1>
        <div>
          <button
            onClick={() => router.push(`/queue/${params.id}/edit`)}
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
        <p><strong>Queue Number:</strong> {queueEntry.queueNumber}</p>
        <p><strong>Patient:</strong> {queueEntry.patient.name}</p>
        <p><strong>Service Counter:</strong> {queueEntry.serviceCounter.name}</p>
        <p><strong>Status:</strong> {queueEntry.queueStatus.name}</p>
        <p><strong>Created At:</strong> {new Date(queueEntry.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(queueEntry.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
