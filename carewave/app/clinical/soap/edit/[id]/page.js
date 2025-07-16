'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSOAPNote, updateSOAPNote } from '@/services/clinicalService';
import { ArrowLeft, Save, X, Clipboard } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
              <Skeleton width="100%" height={100} />
            </div>
            <div>
              <Skeleton width={100} height={20} />
              <Skeleton width="100%" height={100} />
            </div>
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
        <h1 className="text-2xl font-bold text-gradient">Edit SOAP Note</h1>
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
          <h2 className="card-title">Update SOAP Note</h2>
          <p className="card-subtitle">Modify the SOAP note details</p>
        </div>

        <div className="space-y-6">
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
              Save
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