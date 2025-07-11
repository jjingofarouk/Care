import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Typography, Box } from '@mui/material';
import { getAppointmentById, deleteAppointment } from '@/services/appointmentService';

export default async function AppointmentDetailsPage({ params }) {
  const router = useRouter();
  const appointment = await getAppointmentById(params.id);

  if (!appointment) {
    return <p>Appointment not found</p>;
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment(params.id);
      router.push('/appointments');
    }
  }

  return (
    <Box className="p-6 space-y-4">
      <Typography variant="h4">Appointment Details</Typography>
      <Typography><strong>Patient:</strong> {appointment.patient?.name}</Typography>
      <Typography><strong>Doctor:</strong> Dr. {appointment.doctor?.name}</Typography>
      <Typography><strong>Department:</strong> {appointment.department?.name}</Typography>
      <Typography><strong>Visit Type:</strong> {appointment.visitType}</Typography>
      <Typography><strong>Reason:</strong> {appointment.reason}</Typography>
      <Typography><strong>Scheduled At:</strong> {new Date(appointment.scheduledAt).toLocaleString()}</Typography>

      <div className="flex gap-4">
        <Link href={`/appointments/${appointment.id}/edit`} passHref legacyBehavior>
          <Button variant="contained" color="primary">Edit</Button>
        </Link>

        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete
        </Button>

        <Link href="/appointments" passHref legacyBehavior>
          <Button variant="text">Back to List</Button>
        </Link>
      </div>
    </Box>
  );
}