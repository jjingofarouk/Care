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

  if (!emergency) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--hospital-gray-50)]">
      <div className="skeleton h-8 w-64 rounded-lg"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card glass animate-fade-in">
          <div className="card-header border-b-0 pb-0">
            <h2 className="card-title text-2xl text-gradient">Emergency Case Details</h2>
            <p className="card-subtitle mt-1">Case #{formData.patientId}</p>
          </div>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Triage ID</label>
                  <input
                    type="text"
                    value={formData.triageId}
                    onChange={(e) => setFormData({ ...formData, triageId: e.target.value })}
                    className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                    placeholder="Enter Triage ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Admission ID</label>
                  <input
                    type="text"
                    value={formData.admissionId}
                    onChange={(e) => setFormData({ ...formData, admissionId: e.target.value })}
                    className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                    placeholder="Enter Admission ID"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-outline px-6 py-3"
                  onClick={() => setFormData({
                    patientId: emergency.patientId,
                    triageId: emergency.triageId,
                    admissionId: emergency.admissionId || '',
                  })}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary relative overflow-hidden group px-6 py-3"
                >
                  <span className="relative z-10">Update Case</span>
                  <span className="absolute inset-0 bg-[var(--hospital-accent-dark)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--hospital-gray-900)]">Triage Details</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[var(--hospital-gray-600)]">Triage Level:</span>
                    <span className={`badge ${
                      emergency.triage.triageLevel === 'Emergency' ? 'medical-status-emergency' :
                      emergency.triage.triageLevel === 'Critical' ? 'medical-status-critical' :
                      emergency.triage.triageLevel === 'Caution' ? 'medical-status-caution' :
                      'medical-status-stable'
                    }`}>
                      {emergency.triage.triageLevel}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-medium text-[var(--hospital-gray-600)]">Symptoms:</span>
                    <span>{emergency.triage.symptoms}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[var(--hospital-gray-600)]">Assessed At:</span>
                    <span>{new Date(emergency.triage.assessedAt).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--hospital-gray-900)]">Activity Log</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {emergency.logs.length === 0 ? (
                    <p className="text-[var(--hospital-gray-500)]">No logs available</p>
                  ) : (
                    emergency.logs.map((log) => (
                      <div
                        key={log.id}
                        className="border-l-4 border-[var(--hospital-accent)] pl-4 py-3 bg-[var(--hospital-gray-50)] rounded-lg animate-slide-up"
                      >
                        <p className="text-sm font-medium text-[var(--hospital-gray-700)]">{log.description}</p>
                        <p className="text-xs text-[var(--hospital-gray-500)] mt-1">
                          {new Date(log.loggedAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}