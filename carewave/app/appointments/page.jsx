'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
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
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h4" className="text-[var(--hospital-gray-900)]">
          Appointments
        </Typography>
        <Link href="/appointments/new">
          <Button 
            variant="contained" 
            className="btn-primary"
            startIcon={<PlusCircle />}
          >
            New Appointment
          </Button>
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