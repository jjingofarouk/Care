'use client';
import React, { useState } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { createMedicalRecord } from '../medical-records/medicalRecordsService';

export default function HistoryTakingForm({ patients, onSuccess }) {
  const [formData, setFormData] = useState({
    patientId: '',
    recordId: '',
    diagnosis: '',
    presentingComplaint: '',
    familyHistory: '',
    socialHistory: '',
    pastMedicalHistory: '',
    allergies: '',
    medications: '',
    date: '',
    doctorName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicalRecord(formData);
      alert('Medical record created successfully');
      setFormData({
        patientId: '',
        recordId: '',
        diagnosis: '',
        presentingComplaint: '',
        familyHistory: '',
        socialHistory: '',
        pastMedicalHistory: '',
        allergies: '',
        medications: '',
        date: '',
        doctorName: '',
      });
      onSuccess();
    } catch (error) {
      alert('Error creating medical record');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Select Patient"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.patientId}>
                {patient.name} ({patient.patientId})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Record ID"
            name="recordId"
            value={formData.recordId}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Doctor Name"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Presenting Complaint"
            name="presentingComplaint"
            value={formData.presentingComplaint}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Family History"
            name="familyHistory"
            value={formData.familyHistory}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Social History"
            name="socialHistory"
            value={formData.socialHistory}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Past Medical History"
            name="pastMedicalHistory"
            value={formData.pastMedicalHistory}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medications"
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Submit Record
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}