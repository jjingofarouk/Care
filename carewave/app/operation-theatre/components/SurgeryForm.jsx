'use client';

import React, { useState, useEffect } from 'react';
import { getPatients, getTheatres, getSurgicalTeams } from '@/services/operationTheatreService';

const SurgeryForm = ({ onClose, onSuccess, initialData = {} }) => {
  const [formData, setFormData] = useState({
    patientId: initialData.patientId || '',
    theatreId: initialData.theatreId || '',
    surgicalTeamId: initialData.surgicalTeamId || '',
    type: initialData.type || '',
    estimatedDurationMinutes: initialData.estimatedDurationMinutes || '',
    status: initialData.status || 'PLANNED',
    notes: initialData.notes || '',
    preOpAssessmentId: initialData.preOpAssessmentId || '',
  });
  const [patients, setPatients] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [surgicalTeams, setSurgicalTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsData, theatresData, teamsData] = await Promise.all([
          getPatients(),
          getTheatres(),
          getSurgicalTeams(),
        ]);
        setPatients(patientsData);
        setTheatres(theatresData);
        setSurgicalTeams(teamsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = initialData.id ? 'PUT' : 'POST';
      const url = initialData.id ? `/api/surgeries/${initialData.id}` : '/api/surgeries?type=surgery';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save surgery');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="card w-full max-w-lg">
        <div className="card-header">
          <h2 className="card-title">{initialData.id ? 'Edit Surgery' : 'Schedule Surgery'}</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="loading-spinner" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Patient</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="select w-full"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Theatre</label>
              <select
                name="theatreId"
                value={formData.theatreId}
                onChange={handleChange}
                className="select w-full"
                required
              >
                <option value="">Select Theatre</option>
                {theatres.map((theatre) => (
                  <option key={theatre.id} value={theatre.id}>
                    {theatre.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Surgical Team</label>
              <select
                name="surgicalTeamId"
                value={formData.surgicalTeamId}
                onChange={handleChange}
                className="select w-full"
                required
              >
                <option value="">Select Team</option>
                {surgicalTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Surgery Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Estimated Duration (minutes)</label>
              <input
                type="number"
                name="estimatedDurationMinutes"
                value={formData.estimatedDurationMinutes}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select w-full"
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="textarea w-full"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-hospital-gray-700 mb-1">Pre-Op Assessment ID</label>
              <input
                type="text"
                name="preOpAssessmentId"
                value={formData.preOpAssessmentId}
                onChange={handleChange}
                className="input w-full"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurgeryForm;