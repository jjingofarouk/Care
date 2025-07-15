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

  if (!triage) return <div className="skeleton h-8 w-full"></div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Triage Details</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Patient ID"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Triage Level"
            value={formData.triageLevel}
            onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Symptoms"
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="input w-full"
          />
          <input
            type="datetime-local"
            placeholder="Assessed At"
            value={formData.assessedAt}
            onChange={(e) => setFormData({ ...formData, assessedAt: e.target.value })}
            className="input w-full"
          />
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
}