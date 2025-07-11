import React from 'react';
import Link from 'next/link';
import { getAllAppointments } from '@/services/appointmentService';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

export default async function AppointmentsPage() {
  const appointments = await getAllAppointments();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4">Appointments</Typography>
        <Link href="/appointments/new" passHref legacyBehavior>
          <Button variant="contained" startIcon={<PlusCircle />}>
            New Appointment
          </Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Visit Type</TableCell>
            <TableCell>Scheduled At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell>{appt.patient?.name || 'N/A'}</TableCell>
              <TableCell>Dr. {appt.doctor?.name || 'N/A'}</TableCell>
              <TableCell>{appt.department?.name || 'N/A'}</TableCell>
              <TableCell>{appt.visitType}</TableCell>
              <TableCell>{new Date(appt.scheduledAt).toLocaleString()}</TableCell>
              <TableCell className="flex gap-2">
                <Link href={`/appointments/${appt.id}/edit`} passHref legacyBehavior>
                  <Button size="small" variant="outlined" startIcon={<Edit />}>Edit</Button>
                </Link>
                <Link href={`/appointments/${appt.id}`} passHref legacyBehavior>
                  <Button size="small" variant="outlined" color="error" startIcon={<Trash2 />}>
                    Delete
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}