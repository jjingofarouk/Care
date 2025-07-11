import React from 'react';
import { getAppointmentById } from '@/services/appointmentService';
import AppointmentForm from '@/components/appointments/AppointmentForm';

export default async function EditAppointmentPage({ params }) {
  const appointment = await getAppointmentById(params.id);
  
  return (
    <div className="p-6">
      <AppointmentForm appointment={appointment} />
    </div>
  );
}