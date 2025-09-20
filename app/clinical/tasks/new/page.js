'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClinicalTask } from '@/services/clinicalService';
import { ArrowLeft, Save, X, User, UserCog, FileText, CheckCircle } from 'lucide-react';

export default function ClinicalTaskNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    assignedToId: '',
    assignedToType: '',
    description: '',
    status: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClinicalTask(formData);
      router.push('/clinical/tasks');
    } catch (error) {
      console.error('Error creating clinical task:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">New Clinical Task</h1>
        <button
          onClick={() => router.push('/clinical/tasks')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Tasks
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header">
          <h2 className="card-title">Create Clinical Task</h2>
          <p className="card-subtitle">Add a new clinical task</p>
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
                <UserCog size={16} className="text-hospital-accent" />
                Assigned To ID
              </div>
            </label>
            <input
              type="text"
              name="assignedToId"
              value={formData.assignedToId}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter assigned to ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <UserCog size={16} className="text-hospital-accent" />
                Assigned To Type
              </div>
            </label>
            <input
              type="text"
              name="assignedToType"
              value={formData.assignedToType}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter assigned to type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-hospital-accent" />
                Description
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea w-full"
              rows="5"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-hospital-accent" />
                Status
              </div>
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter task status"
            />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary">
              <Save size={20} />
              Create
            </button>
            <button
              type="button"
              onClick={() => router.push('/clinical/tasks')}
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