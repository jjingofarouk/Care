'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSample, updateSample } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function SampleEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ sampleType: '', collectedAt: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSample() {
      try {
        const data = await getSample(params.id);
        setFormData({
          sampleType: data.sampleType,
          collectedAt: new Date(data.collectedAt).toISOString().slice(0, 16),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sample:', error);
        setLoading(false);
      }
    }
    fetchSample();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSample(params.id, formData);
      router.push('/laboratory/samples');
    } catch (error) {
      console.error('Error updating sample:', error);
    }
  };

  if (loading) return (
    <div className="card p-6">
      <div className="skeleton-text w-1/3 mb-4" />
      <div className="space-y-4">
        <div className="skeleton-text" />
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
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">Edit Sample</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Sample Type</label>
            <input
              type="text"
              value={formData.sampleType}
              onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Collected At</label>
            <input
              type="datetime-local"
              value={formData.collectedAt}
              onChange={(e) => setFormData({ ...formData, collectedAt: e.target.value })}
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
              onClick={() => router.push('/laboratory/samples')}
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
