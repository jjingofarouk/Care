'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, User, Stethoscope, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AppointmentForm({ appointment }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    visitTypeId: appointment?.visitTypeId || '',
    appointmentDate: appointment?.appointmentDate
      ? new Date(appointment.appointmentDate).toISOString().slice(0, 16)
      : '',
    status: appointment?.appointmentStatus || 'PENDING',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visitTypes, setVisitTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const [patientRes, doctorRes, visitTypeRes] = await Promise.all([
          fetch('/api/appointments?resource=patients', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/appointments?resource=doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/appointments?resource=visitTypes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!patientRes.ok || !doctorRes.ok || !visitTypeRes.ok)
          throw new Error('Failed to fetch data');

        const [patientData, doctorData, visitTypeData] = await Promise.all([
          patientRes.json(),
          doctorRes.json(),
          visitTypeRes.json(),
        ]);

        setPatients(patientData);
        setDoctors(doctorData);
        setVisitTypes(visitTypeData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData({ ...formData, [name]: value ? value.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const method = appointment?.id ? 'PUT' : 'POST';
      const url = '/api/appointments';
      
      const body = appointment?.id
        ? {
            id: appointment.id,
            patientId: formData.patientId,
            doctorId: formData.doctorId,
            visitTypeId: formData.visitTypeId,
            appointmentDate: formData.appointmentDate,
            status: formData.status,
          }
        : {
            resource: 'appointment',
            patientId: formData.patientId,
            doctorId: formData.doctorId,
            visitTypeId: formData.visitTypeId,
            appointmentDate: formData.appointmentDate,
            status: formData.status,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save appointment');
      }

      router.push('/appointments');
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && !patients.length && !doctors.length && !visitTypes.length) {
    return (
      <div className="card max-w-full p-2">
        <div className="alert alert-error mb-2">
          <span>Error loading form data: {error}</span>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => window.location.reload()}
        >
          <Check className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-full p-2">
      <h2 className="card-title">
        {appointment?.id ? 'Edit Appointment' : 'New Appointment'}
      </h2>
      
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <select
            className="select w-full"
            value={formData.patientId}
            onChange={(e) => handleAutocompleteChange('patientId', patients.find(p => p.id === e.target.value))}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
          <User className="absolute left-3 top-3.5 w-4 h-4 text-[var(--hospital-gray-500)]" />
        </div>

        <div className="relative">
          <select
            className="select w-full"
            value={formData.doctorId}
            onChange={(e) => handleAutocompleteChange('doctorId', doctors.find(d => d.id === e.target.value))}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.department?.name ? `Dr. ${doctor.name} (${doctor.department.name})` : `Dr. ${doctor.name}`}
              </option>
            ))}
          </select>
          <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-[var(--hospital-gray-500)]" />
        </div>

        <div className="relative">
          <select
            name="visitTypeId"
            className="select w-full"
            value={formData.visitTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Visit Type</option>
            {visitTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="datetime-local"
            name="appointmentDate"
            className="input w-full"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
          <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-[var(--hospital-gray-500)]" />
        </div>

        <div className="relative">
          <select
            name="status"
            className="select w-full"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/appointments')}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner mr-2"></div>
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {appointment?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}