'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { emergencyService } from '../../../services/emergencyService';

export default function EmergencyLogDetailPage() {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [formData, setFormData] = useState({
    emergencyCaseId: '',
    description: '',
    loggedAt: '',
  });

  useEffect(() => {
    fetchLog();
  }, [id]);

  const fetchLog = async () => {
    const data = await emergencyService.getEmergencyLog(id);
    setLog(data);
    setFormData({
      emergencyCaseId: data.emergencyCaseId,
      description: data.description,
      loggedAt: new Date(data.loggedAt).toISOString().slice(0, 16),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.updateEmergencyLog(id, formData);
    fetchLog();
  };

  if (!log) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--hospital-gray-50)]">
      <div className="skeleton h-8 w-64 rounded-lg"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="card glass animate-fade-in">
          <div className="card-header border-b-0 pb-0">
            <h2 className="card-title text-2xl text-gradient">Emergency Log Details</h2>
            <p className="card-subtitle mt-1">Log #{formData.emergencyCaseId}</p>
          </div>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Emergency Case ID</label>
                <input
                  type="text"
                  value={formData.emergencyCaseId}
                  onChange={(e) => setFormData({ ...formData, emergencyCaseId: e.target.value })}
                  className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                  placeholder="Enter Emergency Case ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea w-full h-32 focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                  placeholder="Enter log description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Logged At</label>
                <input
                  type="datetime-local"
                  value={formData.loggedAt}
                  onChange={(e) => setFormData({ ...formData, loggedAt: e.target.value })}
                  className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="btn btn-outline px-6 py-3"
                  onClick={() => setFormData({
                    emergencyCaseId: log.emergencyCaseId,
                    description: log.description,
                    loggedAt: new Date(log.loggedAt).toISOString().slice(0, 16),
                  })}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary relative overflow-hidden group px-6 py-3"
                >
                  <span className="relative z-10">Update Log</span>
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