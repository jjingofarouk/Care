'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSample } from '@/services/laboratoryService';
import { ArrowLeft } from 'lucide-react';

export default function SampleView({ params }) {
  const router = useRouter();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSample() {
      try {
        const data = await getSample(params.id);
        setSample(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sample:', error);
        setLoading(false);
      }
    }
    fetchSample();
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
  if (!sample) return (
    <div className="alert alert-error">
      Sample not found
    </div>
  );

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Sample Details</h1>
        <button
          onClick={() => router.push('/laboratory/samples')}
          className="btn btn-secondary gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Samples
        </button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Sample for {sample.patient.firstName} {sample.patient.lastName}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Patient</h3>
            <p className="text-[var(--hospital-gray-900)]">{sample.patient.firstName} {sample.patient.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Sample Type</h3>
            <p className="text-[var(--hospital-gray-900)]">{sample.sampleType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Collected At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(sample.collectedAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Created At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(sample.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Updated At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(sample.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
