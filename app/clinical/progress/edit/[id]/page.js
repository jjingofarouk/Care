'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProgressNote, updateProgressNote } from '@/services/clinicalService';
import { ArrowLeft, Save, X, FileText } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProgressNoteEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ note: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getProgressNote(params.id);
        setFormData({ note: data.note });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress note:', error);
        setLoading(false);
      }
    }
    fetchNote();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProgressNote(params.id, formData);
      router.push('/clinical/progress');
    } catch (error) {
      console.error('Error updating progress note:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ note: e.target.value });
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
        <h1 className="text-2xl font-bold text-gradient">Edit Progress Note</h1>
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
          <h2 className="card-title">Update Progress Note</h2>
          <p className="card-subtitle">Modify the progress note details</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-hospital-accent" />
              Note
            </div>
          </label>
          <textarea
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
            Save
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
      </form>
    </div>
  );
}