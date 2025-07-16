'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalNote, updateClinicalNote } from '@/services/clinicalService';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Clinical Note</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Note</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
            rows="5"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-hospital-accent text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/clinical')}
            className="bg-hospital-gray-200 text-hospital-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
