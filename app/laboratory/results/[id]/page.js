'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLabResult } from '@/services/laboratoryService';
import { ArrowLeft } from 'lucide-react';

export default function LabResultView({ params }) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const data = await getLabResult(params.id);
        setResult(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab result:', error);
        setLoading(false);
      }
    }
    fetchResult();
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
  if (!result) return (
    <div className="alert alert-error">
      Result not found
    </div>
  );

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Lab Result Details</h1>
        <button
          onClick={() => router.push('/laboratory/results')}
          className="btn btn-secondary gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Results
        </button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Result for {result.labRequest.patient.firstName} {result.labRequest.patient.lastName}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Patient</h3>
            <p className="text-[var(--hospital-gray-900)]">{result.labRequest.patient.firstName} {result.labRequest.patient.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Lab Test</h3>
            <p className="text-[var(--hospital-gray-900)]">{result.labRequest.labTest.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Result</h3>
            <p className="text-[var(--hospital-gray-900)]">{result.result}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Resulted At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(result.resultedAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Created At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(result.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Updated At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(result.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
