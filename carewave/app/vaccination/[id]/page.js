// app/vaccination/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { vaccinationService } from '../../services/vaccinationService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function VaccinationDetailPage() {
  const { id } = useParams();
  const [vaccination, setVaccination] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    vaccineId: '',
    immunizationScheduleId: '',
    administeredDate: '',
  });
  const [vaccines, setVaccines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaccination();
    fetchVaccines();
    fetchSchedules();
  }, [id]);

  const fetchVaccination = async () => {
    setLoading(true);
    const data = await vaccinationService.getVaccination(id);
    setVaccination(data);
    setFormData({
      patientId: data.patientId,
      vaccineId: data.vaccineId,
      immunizationScheduleId: data.immunizationScheduleId || '',
      administeredDate: new Date(data.administeredDate).toISOString().split('T')[0],
    });
    setLoading(false);
  };

  const fetchVaccines = async () => {
    const data = await vaccinationService.getVaccines();
    setVaccines(data);
  };

  const fetchSchedules = async () => {
    const data = await vaccinationService.getSchedules();
    setSchedules(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await vaccinationService.updateVaccination(id, formData);
    await fetchVaccination();
    setLoading(false);
  };

  if (!vaccination || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50">
        <Skeleton height={400} width={800} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="rounded-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hospital-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card glass animate-fade-in shadow-lg">
          <div className="card-header border-b-0 pb-0">
            <h2 className="card-title text-2xl text-gradient">Vaccination Record Details</h2>
            <p className="card-subtitle mt-1">Record #{vaccination.id}</p>
          </div>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-hospital-gray-600">Patient ID</label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="input w-full focus:ring-2 focus:ring-hospital-accent transition-all duration-300"
                    placeholder="Enter Patient ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-hospital-gray-600">Vaccine</label>
                  <select
                    value={formData.vaccineId}
                    onChange={(e) => setFormData({ ...formData, vaccineId: e.target.value })}
                    className="input w-full focus:ring-2 focus:ring-hospital-accent transition-all duration-300"
                  >
                    <option value="">Select Vaccine</option>
                    {vaccines.map((vaccine) => (
                      <option key={vaccine.id} value={vaccine.id}>
                        {vaccine.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-hospital-gray-600">Immunization Schedule</label>
                  <select
                    value={formData.immunizationScheduleId}
                    onChange={(e) => setFormData({ ...formData, immunizationScheduleId: e.target.value })}
                    className="input w-full focus:ring-2 focus:ring-hospital-accent transition-all duration-300"
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-hospital-gray-600">Administered Date</label>
                  <input
                    type="date"
                    value={formData.administeredDate}
                    onChange={(e) => setFormData({ ...formData, administeredDate: e.target.value })}
                    className="input w-full focus:ring-2 focus:ring-hospital-accent transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-outline px-6 py-3"
                  onClick={() =>
                    setFormData({
                      patientId: vaccination.patientId,
                      vaccineId: vaccination.vaccineId,
                      immunizationScheduleId: vaccination.immunizationScheduleId || '',
                      administeredDate: new Date(vaccination.administeredDate).toISOString().split('T')[0],
                    })
                  }
                >
                  Reset
                </button>
                <button type="submit" className="btn btn-primary relative overflow-hidden group px-6 py-3">
                  <span className="relative z-10">Update Record</span>
                  <span className="absolute inset-0 bg-hospital-accent-dark opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-hospital-gray-900">Vaccine Details</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-hospital-gray-600">Name:</span>
                    <span>{vaccination.vaccine?.name || 'Unknown'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-medium text-hospital-gray-600">Description:</span>
                    <span>{vaccination.vaccine?.description || 'No description'}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-hospital-gray-900">Schedule Details</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-hospital-gray-600">Name:</span>
                    <span>{vaccination.immunizationSchedule?.name || 'None'}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-medium text-hospital-gray-600">Description:</span>
                    <span>{vaccination.immunizationSchedule?.description || 'No description'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
