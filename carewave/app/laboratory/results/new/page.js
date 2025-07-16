'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLabResult } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabResultNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    labRequestId: '',
    result: '',
    resultedAt: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLabResult(formData);
      router.push('/laboratory/results');
    } catch (error) {
      console.error('Error creating lab result:', error);
    }
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">New Lab Result</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Lab Request ID</label>
            <input
              type="text"
              value={formData.labRequestId}
              onChange={(e) => setFormData({ ...formData, labRequestId: e.target.value })}
              className="input w-full"
            />
          </div>
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
              Create
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
