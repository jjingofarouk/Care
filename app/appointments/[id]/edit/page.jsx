'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppointmentForm from '@/components/appointments/AppointmentForm';

export default function EditAppointmentPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments?id=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch appointment');
        const data = await response.json();
        setAppointment({
          ...data,
          appointmentDate: new Date(data.appointmentDate).toISOString().slice(0, 16),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  if (loading) return <div className="loading-spinner mx-auto mt-4"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return <AppointmentForm appointment={appointment} />;
}