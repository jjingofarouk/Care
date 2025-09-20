'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLabTest } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabTestNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLabTest(formData);
      router.push('/laboratory');
    } catch (error) {
      console.error('Error creating lab test:', error);
    }
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">New Lab Test</h1>
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
              Create
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
