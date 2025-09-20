'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { emergencyService } from '../../../services/emergencyService';

export default function TriageDetailPage() {
  const { id } = useParams();
  const [triage, setTriage] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    triageLevel: '',
    symptoms: '',
    assessedAt: '',
  });

  useEffect(() => {
    fetchTriage();
  }, [id]);

  const fetchTriage = async () => {
    const data = await emergencyService.getTriage(id);
    setTriage(data);
    setFormData({
      patientId: data.patientId,
      triageLevel: data.triageLevel,
      symptoms: data.symptoms,
      assessedAt: new Date(data.assessedAt).toISOString().slice(0, 16),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.updateTriage(id, formData);
    fetchTriage();
  };

  if (!triage) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--hospital-gray-50)]">
      <div className="skeleton h-8 w-64 rounded-lg"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="card glass animate-fade-in">
          <div className="card-header border-b-0 pb-0">
            <h2 className="card-title text-2xl text-gradient">Triage Details</h2>
            <p className="card-subtitle mt-1">Patient Record #{formData.patientId}</p>
          </div>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Patient ID</label>
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                  placeholder="Enter Patient ID"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Triage Level</label>
                <select
                  value={formData.triageLevel}
                  onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })}
                  className="select w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                >
                  <option value="">Select Triage Level</option>
                  <option value="Emergency" className="medical-status-emergency">Emergency</option>
                  <option value="Critical" className="medical-status-critical">Critical</option>
                  <option value="Caution" className="medical-status-caution">Caution</option>
                  <option value="Stable" className="medical-status-stable">Stable</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Symptoms</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="textarea w-full h-32 focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                  placeholder="Describe patient symptoms"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Assessment Date</label>
                <input
                  type="datetime-local"
                  value={formData.assessedAt}
                  onChange={(e) => setFormData({ ...formData, assessedAt: e.target.value })}
                  className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setFormData({
                    patientId: triage.patientId,
                    triageLevel: triage.triageLevel,
                    symptoms: triage.symptoms,
                    assessedAt: new Date(triage.assessedAt).toISOString().slice(0, 16),
                  })}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary relative overflow-hidden group"
                >
                  <span className="relative z-10">Update Triage</span>
                  <span className="absolute inset-0 bg-[var(--hospital-accent-dark)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}