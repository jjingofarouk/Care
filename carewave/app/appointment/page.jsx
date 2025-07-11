import React from 'react';
import { getAllAppointments } from '@/services/appointmentService';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentFilter from '@/components/appointments/AppointmentFilter';
import AppointmentStats from '@/components/appoitments/AppointmentStats';
import { Button, Typography } from '@mui/material';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AppointmentsPage({ searchParams }) {
  const filters = {
    status: searchParams.status || '',
    doctorId: searchParams.doctorId || '',
    patientId: searchParams.patientId || '',
    dateFrom: searchParams.dateFrom || '',
    dateTo: searchParams.dateTo || '',
  };
  const appointments = await getAllAppointments(filters);

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
      <AppointmentStats />
      <AppointmentFilter initialFilters={filters} />
      <AppointmentTable appointments={appointments} />
    </div>
  );
}