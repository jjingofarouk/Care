'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLabRequest, updateLabRequest } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabRequestEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ sampleId: '', requestedAt: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const data = await getLabRequest(params.id);
        setFormData({
          sampleId: data.sampleId || '',
          requestedAt: data.requestedAt ? new Date(data.requestedAt).toISOString().slice(0, 16) : '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab request:', error);
        setLoading(false);
      }
    }
    fetchRequest();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLabRequest(params.id, formData);
      router.push('/laboratory/requests');
    } catch (error) {
      console.error('Error updating lab request:', error);
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
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">Edit Lab Request</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Sample ID</label>
            <input
              type="text"
              value={formData.sampleId}
              onChange={(e) => setFormData({ ...formData, sampleId: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Requested At</label>
            <input
              type="datetime-local"
              value={formData.requestedAt}
              onChange={(e) => setFormData({ ...formData, requestedAt: e.target.value })}
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
              onClick={() => router.push('/laboratory/requests')}
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