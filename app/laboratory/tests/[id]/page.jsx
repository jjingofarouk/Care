'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLabTest } from '@/services/laboratoryService';
import { ArrowLeft } from 'lucide-react';

export default function LabTestView({ params }) {
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTest() {
      try {
        const data = await getLabTest(params.id);
        setTest(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab test:', error);
        setLoading(false);
      }
    }
    fetchTest();
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
  if (!test) return (
    <div className="alert alert-error">
      Test not found
    </div>
  );

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Lab Test Details</h1>
        <button
          onClick={() => router.push('/laboratory')}
          className="btn btn-secondary gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tests
        </button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{test.name}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Description</h3>
            <p className="text-[var(--hospital-gray-900)]">{test.description || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Created At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(test.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--hospital-gray-700)]">Updated At</h3>
            <p className="text-[var(--hospital-gray-900)]">{new Date(test.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
