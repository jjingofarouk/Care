'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLabTest, updateLabTest } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabTestEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTest() {
      try {
        const data = await getLabTest(params.id);
        setFormData({ name: data.name, description: data.description || '' });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab test:', error);
        setLoading(false);
      }
    }
    fetchTest();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLabTest(params.id, formData);
      router.push('/laboratory');
    } catch (error) {
      console.error('Error updating lab test:', error);
    }
  };

  if (loading) return (
    <div className="card p-6">
      <div className="skeleton-text w-1/3 mb-4" />
      <div className="space-y-4">
        <div className="skeleton-text" />
        <div className="skeleton-text h-24" />
        <div className="flex space-x-2">
          <div className="skeleton-text w-20" />
          <div className="skeleton-text w-20" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">Edit Lab Test</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea w-full"
              rows="5"
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
              onClick={() => router.push('/laboratory')}
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
