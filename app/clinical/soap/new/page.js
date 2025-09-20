'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSOAPNote } from '@/services/clinicalService';
import { ArrowLeft, Save, X, User, Stethoscope, Clipboard } from 'lucide-react';

export default function SOAPNoteNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSOAPNote(formData);
      router.push('/clinical/soap');
    } catch (error) {
      console.error('Error creating SOAP note:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">New SOAP Note</h1>
        <button
          onClick={() => router.push('/clinical/soap')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Notes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header">
          <h2 className="card-title">Create SOAP Note</h2>
          <p className="card-subtitle">Add a new SOAP note</p>
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
                <Clipboard size={16} className="text-hospital-accent" />
                Subjective
              </div>
            </label>
            <textarea
              name="subjective"
              value={formData.subjective}
              onChange={handleChange}
              className="textarea w-full"
              rows="5"
              placeholder="Enter subjective details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Clipboard size={16} className="text-hospital-accent" />
                Objective
              </div>
            </label>
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              className="textarea w-full"
              rows="5"
              placeholder="Enter objective details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Clipboard size={16} className="text-hospital-accent" />
                Assessment
              </div>
            </label>
            <textarea
              name="assessment"
              value={formData.assessment}
              onChange={handleChange}
              className="textarea w-full"
              rows="5"
              placeholder="Enter assessment details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Clipboard size={16} className="text-hospital-accent" />
                Plan
              </div>
            </label>
            <textarea
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="textarea w-full"
              rows="5"
              placeholder="Enter plan details"
            />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary">
              <Save size={20} />
              Create
            </button>
            <button
              type="button"
              onClick={() => router.push('/clinical/soap')}
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