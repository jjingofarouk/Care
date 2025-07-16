'use client';
// pages/clinical/[id].jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClinicalNote } from '@/services/clinicalService';
import { ArrowLeft, User, Stethoscope, FileText, Calendar } from 'lucide-react';

export default function ClinicalNoteView({ params }) {
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const data = await getClinicalNote(params.id);
        setNote(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical note:', error);
        setLoading(false);
      }
    }
    fetchNote();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="alert alert-error animate-fade-in">
        <FileText size={20} />
        <span>Note not found</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gradient">Clinical Note</h1>
        <button
          onClick={() => router.push('/clinical')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Notes
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Note Details</h2>
          <p className="card-subtitle">Patient medical record information</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <User size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Patient</h3>
              <p className="text-hospital-gray-900">{note.patient.firstName} {note.patient.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Stethoscope size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Doctor</h3>
              <p className="text-hospital-gray-900">{note.doctor.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Note</h3>
              <p className="text-hospital-gray-900">{note.note}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Created At</h3>
              <p className="text-hospital-gray-900">{new Date(note.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Updated At</h3>
              <p className="text-hospital-gray-900">{new Date(note.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}