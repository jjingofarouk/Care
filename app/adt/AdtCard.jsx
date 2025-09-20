"use client";
import React from 'react';
import { Card, CardContent, CardHeader, Chip, Button, Typography, Box } from '@mui/material';
import { Person, LocalHospital, CalendarToday, MedicalServices } from '@mui/icons-material';

export default function AdmissionCard({ admission, onViewDetails }) {
  const statusColor = admission.status === 'ADMITTED' ? 'success' : 'error';

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardHeader
        title={admission.patient.user.name}
        subheader={`Admission ID: ${admission.id}`}
        action={<Chip label={admission.status} color={statusColor} />}
      />
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Person sx={{ mr: 1 }} />
          <Typography><strong>Patient:</strong> {admission.patient.user.name}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <LocalHospital sx={{ mr: 1 }} />
          <Typography><strong>Ward:</strong> {admission.ward?.name || 'N/A'}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <CalendarToday sx={{ mr: 1 }} />
          <Typography><strong>Admission Date:</strong> {new Date(admission.admissionDate).toLocaleDateString()}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <MedicalServices sx={{ mr: 1 }} />
          <Typography><strong>Doctor:</strong> {admission.doctor?.user.name || 'N/A'}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography><strong>Triage Priority:</strong> {admission.triagePriority || 'N/A'}</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => onViewDetails(admission)} sx={{ mt: 2 }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}