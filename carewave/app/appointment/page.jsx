import React from 'react';
import { getAllAppointments } from '@/services/appointmentService';
import AppointmentTable from '@/components/AppointmentTable';
import { Button, Typography } from '@mui/material';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AppointmentsPage() {
  const appointments = await getAllAppointments({});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
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
      <AppointmentTable appointments={appointments} />
    </div>
  );
}