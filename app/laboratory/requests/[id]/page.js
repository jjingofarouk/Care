'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLabRequest } from '@/services/laboratoryService';
import { ArrowLeft } from 'lucide-react';

export default function LabRequestView({ params }) {
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const data = await getLabRequest(params.id);
        setRequest(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab request:', error);
        setLoading(false);
      }
    }
    fetchRequest();
  }, [params.id]);

  if (loading) return (
    <div className="card p-6">
      <div className="skeleton-text w-1/3 mb-4" />
      <div className="space-y-4">
        <div className="skeleton-text" />
        <div className="skeleton-text" />
        <div className="skeleton-text" />
      </div>
    </div>
  );
  if (!request) return (
    <div className="alert alert-error">
      Request not found
    </div>
  );

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Lab Request Details</h1>
        <button
          onClick={() => router.push('/laboratory/requests')}
          className="btn btn-secondary gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Requests
        </button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Request for {request.patient.firstName} {request.patient.lastName}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Patient</h3>
            <p className="text-[var(--hospital-gray-900)]">{request.patient.firstName} {request.patient.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Lab Test</h3>
            <p className="text-[var(--hospital-gray-900)]">{request.labTest.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Sample</h3>
            <p className="text-[var(--hospital-gray-900)]">{request.sample?.sampleType || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Requested At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(request.requestedAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Created At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(request.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Updated At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(request.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}