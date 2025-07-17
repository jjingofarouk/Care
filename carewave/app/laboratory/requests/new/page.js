'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLabRequest } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabRequestNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    labTestId: '',
    sampleId: '',
    requestedAt: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLabRequest(formData);
      router.push('/laboratory/requests');
    } catch (error) {
      console.error('Error creating lab request:', error);
    }
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">New Lab Request</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Patient ID</label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Lab Test ID</label>
            <input
              type="text"
              value={formData.labTestId}
              onChange={(e) => setFormData({ ...formData, labTestId: e.target.value })}
              className="input w-full"
            />
          </div>
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
              Create
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