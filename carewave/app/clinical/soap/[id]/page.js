'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSOAPNote } from '@/services/clinicalService';

export default function SOAPNoteView({ params }) {
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getSOAPNote(params.id);
        setNote(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching SOAP note:', error);
        setLoading(false);
      }
    }
    fetchNote();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">SOAP Note</h1>
        <button
          onClick={() => router.push('/clinical/soap')}
          className="bg-hospital-accent text-white px-4 py-2 rounded"
        >
          Back to Notes
        </button>
      </div>
      <div className="bg-hospital-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Patient</h2>
          <p>{note.patient.firstName} {note.patient.lastName}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Doctor</h2>
          <p>{note.doctor.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Subjective</h2>
          <p>{note.subjective || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Objective</h2>
          <p>{note.objective || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Assessment</h2>
          <p>{note.assessment || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Plan</h2>
          <p>{note.plan || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Created At</h2>
          <p>{new Date(note.createdAt).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Updated At</h2>
          <p>{new Date(note.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
