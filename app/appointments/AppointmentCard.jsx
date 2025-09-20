import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { format } from 'date-fns';

export default function AppointmentCard({ appointment, onEdit, onCancel, onCheckIn, onCheckOut }) {
  const { id, patient, doctor, date, status, type, reason, notes, checkInTime, checkOutTime, queue } = appointment;

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Appointment #{id}</Typography>
          <Chip label={status} color={status === 'SCHEDULED' ? 'primary' : status === 'COMPLETED' ? 'success' : 'error'} />
        </Box>
        <Typography><strong>Patient:</strong> {patient.user.name}</Typography>
        <Typography><strong>Doctor:</strong> {doctor.user.name} ({doctor.specialty})</Typography>
        <Typography><strong>Date:</strong> {format(new Date(date), 'PPp')}</Typography>
        <Typography><strong>Type:</strong> {type}</Typography>
        <Typography><strong>Reason:</strong> {reason}</Typography>
        {notes && <Typography><strong>Notes:</strong> {notes}</Typography>}
        {checkInTime && <Typography><strong>Checked In:</strong> {format(new Date(checkInTime), 'PPp')}</Typography>}
        {checkOutTime && <Typography><strong>Checked Out:</strong> {format(new Date(checkOutTime), 'PPp')}</Typography>}
        {queue && <Typography><strong>Queue Number:</strong> {queue.queueNumber} ({queue.status})</Typography>}
        <Box mt={2} display="flex" gap={1}>
          {status === 'SCHEDULED' && (
            <>
              <Button variant="contained" onClick={() => onCheckIn(id)}>Check In</Button>
              <Button variant="outlined" onClick={() => onEdit(appointment)}>Edit</Button>
              <Button variant="outlined" color="error" onClick={() => onCancel(id)}>Cancel</Button>
            </>
          )}
          {status === 'CHECKED_IN' && (
            <Button variant="contained" onClick={() => onCheckOut(id)}>Check Out</Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
