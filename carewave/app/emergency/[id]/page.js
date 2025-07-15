'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { emergencyService } from '../../services/emergencyService';

export default function EmergencyDetailPage() {
  const { id } = useParams();
  const [emergency, setEmergency] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    triageId: '',
    admissionId: '',
  });

  useEffect(() => {
    fetchEmergency();
  }, [id]);

  const fetchEmergency = async () => {
    const data = await emergencyService.getEmergency(id);
    setEmergency(data);
    setFormData({
      patientId: data.patientId,
      triageId: data.triageId,
      admissionId: data.admissionId || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.updateEmergency(id, formData);
    fetchEmergency();
  };

  if (!emergency) return <div className="skeleton h-8 w-full"></div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Emergency Case Details</h2>
      </div>
      <div className="p-6 space-y-6">
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
            placeholder="Triage ID"
            value={formData.triageId}
            onChange={(e) => setFormData({ ...formData, triageId: e.target.value })}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Admission ID"
            value={formData.admissionId}
            onChange={(e) => setFormData({ ...formData, admissionId: e.target.value })}
            className="input w-full"
          />
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
        <div>
          <h3 className="text-lg font-semibold text-hospital-gray-900 mb-2">Triage Details</h3>
          <p>Triage Level: <span className="badge badge-info">{emergency.triage.triageLevel}</span></p>
          <p>Symptoms: {emergency.triage.symptoms}</p>
          <p>Assessed At: {new Date(emergency.triage.assessedAt).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-hospital-gray-900 mb-2">Logs</h3>
          {emergency.logs.map((log) => (
            <div key={log.id} className="border-l-4 border-hospital-gray-200 pl-4 mb-2">
              <p>Description: {log.description}</p>
              <p>Logged At: {new Date(log.loggedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}