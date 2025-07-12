'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentStats from '@/components/appointments/AppointmentStats';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments', {
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
    <div className="max-w-full mx-auto p-2 sm:p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" className="text-[var(--hospital-gray-900)] font-bold text-2xl">
          Appointments
        </Typography>
        <Link href="/appointments/new">
          <Button 
            variant="contained" 
            className="btn-primary bg-[var(--hospital-accent)] hover:bg-[var(--hospital-accent-dark)] text-[var(--hospital-white)] px-4 py-2"
            startIcon={<PlusCircle className="h-5 w-5" />}
          >
            New Appointment
          </Button>
        </Link>
      </Box>
      <AppointmentStats />
      {error && (
        <div className="alert alert-error mb-4 rounded-lg">
          <span>{error}</span>
        </div>
      )}
      <AppointmentTable appointments={appointments} loading={loading} />
    </div>
  );
}