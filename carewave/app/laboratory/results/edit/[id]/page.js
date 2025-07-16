'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLabResult, updateLabResult } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabResultEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ result: '', resultedAt: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const data = await getLabResult(params.id);
        setFormData({
          result: data.result,
          resultedAt: new Date(data.resultedAt).toISOString().slice(0, 16),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab result:', error);
        setLoading(false);
      }
    }
    fetchResult();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLabResult(params.id, formData);
      router.push('/laboratory/results');
    } catch (error) {
      console.error('Error updating lab result:', error);
    }
  };

  if (loading) return (
    <div className="card p-6">
      <div className="skeleton-text w-1/3 mb-4" />
      <div className="space-y-4">
        <div className="skeleton-text h-24" />
        <div className="skeleton-text" />
        <div className="flex space-x-2">
          <div className="skeleton-text w-20" />
          <div className="skeleton-text w-20" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">Edit Lab Result</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Result</label>
            <textarea
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className="textarea w-full"
              rows="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Resulted At</label>
            <input
              type="datetime-local"
              value={formData.resultedAt}
              onChange={(e) => setFormData({ ...formData, resultedAt: e.target.value })}
              className="input w-full"
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            <button
              type="button"
              onClick={() => router.push('/laboratory/results')}
              className="btn btn-secondary flex-1 gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
