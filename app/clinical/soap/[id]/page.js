'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSOAPNote } from '@/services/clinicalService';
import { ArrowLeft, User, Stethoscope, FileText, Calendar, Clipboard } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
              <Skeleton width="60%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="40%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="80%" height={16} count={2} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="80%" height={16} count={2} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="80%" height={16} count={2} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="80%" height={16} count={2} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="50%" height={16} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="50%" height={16} />
            </div>
          </div>
        </div>
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
        <h1 className="text-2xl font-bold text-gradient">SOAP Note</h1>
        <button
          onClick={() => router.push('/clinical/soap')}
          className="btn btn-outline"
        >
          <ArrowLeft size={20} />
          Back to Notes
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">SOAP Note Details</h2>
          <p className="card-subtitle">Patient clinical SOAP record</p>
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
            <Clipboard size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Subjective</h3>
              <p className="text-hospital-gray-900">{note.subjective || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clipboard size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Objective</h3>
              <p className="text-hospital-gray-900">{note.objective || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clipboard size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Assessment</h3>
              <p className="text-hospital-gray-900">{note.assessment || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clipboard size={20} className="text-hospital-accent mt-1" />
            <div>
              <h3 className="font-semibold text-hospital-gray-700">Plan</h3>
              <p className="text-hospital-gray-900">{note.plan || 'N/A'}</p>
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