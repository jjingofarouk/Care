'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSOAPNote, updateSOAPNote } from '@/services/clinicalService';

export default function SOAPNoteEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getSOAPNote(params.id);
        setFormData({
          subjective: data.subjective || '',
          objective: data.objective || '',
          assessment: data.assessment || '',
          plan: data.plan || '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching SOAP note:', error);
        setLoading(false);
      }
    }
    fetchNote();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSOAPNote(params.id, formData);
      router.push('/clinical/soap');
    } catch (error) {
      console.error('Error updating SOAP note:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit SOAP Note</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Subjective</label>
          <textarea
            value={formData.subjective}
            onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
            rows="5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Objective</label>
          <textarea
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
            rows="5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Assessment</label>
          <textarea
            value={formData.assessment}
            onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
            rows="5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Plan</label>
          <textarea
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
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
            onClick={() => router.push('/clinical/soap')}
            className="bg-hospital-gray-200 text-hospital-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
