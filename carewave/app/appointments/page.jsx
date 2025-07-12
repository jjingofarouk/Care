'use client';
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import AppointmentFilter from '@/components/appointments/AppointmentFilter';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentStats from '@/components/appointments/AppointmentStats';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async (filters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/appointments?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-full mx-auto p-1 sm:p-2">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--hospital-gray-900)]">
          Appointments
        </h1>
        <Link href="/appointments/new">
          <button className="btn btn-primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Appointment
          </button>
        </Link>
      </div>
      <AppointmentStats />
      <AppointmentFilter onFilterChange={fetchAppointments} />
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      <AppointmentTable appointments={appointments} loading={loading} />
    </div>
  );
}