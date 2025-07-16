'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProgressNote } from '@/services/clinicalService';
import { ArrowLeft, Save, X, User, Stethoscope, FileText } from 'lucide-react';

export default function ProgressNoteNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    note: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProgressNote(formData);
      router.push('/clinical/progress');
    } catch (error) {
      console.error('Error creating progress note:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">New Progress Note</h1>
        <button
          onClick={() => router.push('/clinical/progress')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Notes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header">
          <h2 className="card-title">Create Progress Note</h2>
          <p className="card-subtitle">Add a new progress note</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <User size={16} className="text-hospital-accent" />
                Patient ID
              </div>
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter patient ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Stethoscope size={16} className="text-hospital-accent" />
                Doctor ID
              </div>
            </label>
            <input
              type="text"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter doctor ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-hospital-accent" />
                Note
              </div>
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="textarea w-full"
              rows="5"
              placeholder="Enter progress note details"
            />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary">
              <Save size={20} />
              Create
            </button>
            <button
              type="button"
              onClick={() => router.push('/clinical/progress')}
              className="btn btn-secondary"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}