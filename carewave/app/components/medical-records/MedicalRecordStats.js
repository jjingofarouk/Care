import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

export default function MedicalRecordStats({ stats }) {
  const statItems = [
    { label: 'Total Records', value: stats.totalRecords },
    { label: 'Allergies', value: stats.totalAllergies },
    { label: 'Diagnoses', value: stats.totalDiagnoses },
    { label: 'Vital Signs', value: stats.totalVitalSigns },
    { label: 'Chief Complaints', value: stats.totalChiefComplaints },
    { label: 'Present Illnesses', value: stats.totalPresentIllnesses },
    { label: 'Past Conditions', value: stats.totalPastConditions },
    { label: 'Surgical History', value: stats.totalSurgicalHistory },
    { label: 'Family History', value: stats.totalFamilyHistory },
    { label: 'Medications', value: stats.totalMedicationHistory },
    { label: 'Social History', value: stats.totalSocialHistory },
    { label: 'Review of Systems', value: stats.totalReviewOfSystems },
    { label: 'Immunizations', value: stats.totalImmunizations },
    { label: 'Travel History', value: stats.totalTravelHistory },
    { label: 'Avg Records/Patient', value: stats.averageRecordsPerPatient.toFixed(2) }
  ];

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Statistics</Typography>
        <Grid container spacing={2}>
          {statItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              <Typography variant="h6">{item.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}