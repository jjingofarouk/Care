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

  if (!log) return <div className="skeleton h-8 w-full"></div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Emergency Log Details</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Emergency Case ID"
            value={formData.emergencyCaseId}
            onChange={(e) => setFormData({ ...formData, emergencyCaseId: e.target.value })}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input w-full"
          />
          <input
            type="datetime-local"
            placeholder="Logged At"
            value={formData.loggedAt}
            onChange={(e) => setFormData({ ...formData, loggedAt: e.target.value })}
            className="input w-full"
          />
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
}