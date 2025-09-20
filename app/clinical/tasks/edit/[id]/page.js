'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalTask, updateClinicalTask } from '@/services/clinicalService';
import { ArrowLeft, Save, X, FileText, CheckCircle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ClinicalTaskEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getClinicalTask(params.id);
        setFormData({
          description: data.description || '',
          status: data.status || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical task:', error);
        setLoading(false);
      }
    }
    fetchTask();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClinicalTask(params.id, formData);
      router.push('/clinical/tasks');
    } catch (error) {
      console.error('Error updating clinical task:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width={200} height={32} />
          <Skeleton width={120} height={40} />
        </div>
        <div className="card">
          <div className="space-y-6">
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="100%" height={100} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="100%" height={40} />
            </div>
            <div className="flex space-x-2">
              <Skeleton width={80} height={40} />
              <Skeleton width={80} height={40} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">Edit Clinical Task</h1>
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
          <h2 className="card-title">Update Clinical Task</h2>
          <p className="card-subtitle">Modify the clinical task details</p>
        </div>

        <div className="space-y-6">
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
              Save
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