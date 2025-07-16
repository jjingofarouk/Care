'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalNote, updateClinicalNote } from '@/services/clinicalService';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function ClinicalNoteEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ note: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getClinicalNote(params.id);
        setFormData({ note: data.note });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical note:', error);
        setLoading(false);
      }
    }
    fetchNote();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClinicalNote(params.id, formData);
      router.push('/clinical');
    } catch (error) {
      console.error('Error updating clinical note:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ note: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">Edit Clinical Note</h1>
        <button
          onClick={() => router.push('/clinical')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Notes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-header">
          <h2 className="card-title">Update Note</h2>
          <p className="card-subtitle">Modify the clinical note details</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-hospital-gray-700 mb-1">
            Note
          </label>
          <textarea
            value={formData.note}
            onChange={handleChange}
            className="textarea w-full"
            rows="5"
            placeholder="Enter clinical note details"
          />
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="btn btn-primary">
            <Save size={20} />
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/clinical')}
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