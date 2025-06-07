"use client";
import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Paper, Typography, Alert } from '@mui/material';
import { createMedicalRecord } from '../medical-records/medicalRecordsService';
import styles from './PatientForm.module.css';

export default function MedicalHistoryForm({ patient, onSubmit }) {
  const [formData, setFormData] = useState({
    recordId: '',
    diagnosis: '',
    presentingComplaint: '',
    familyHistory: '',
    socialHistory: '',
    pastMedicalHistory: '',
    allergies: '',
    medications: '',
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicalRecord({
        ...formData,
        patientId: patient.id,
      });
      onSubmit();
      setFormData({
        recordId: '',
        diagnosis: '',
        presentingComplaint: '',
        familyHistory: '',
        socialHistory: '',
        pastMedicalHistory: '',
        allergies: '',
        medications: '',
        date: new Date().toISOString().split('T')[0],
        doctorName: '',
      });
      setError(null);
    } catch (error) {
      console.error('Error creating medical record:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  return (
    <Paper className={styles.paper}>
      <Typography variant="h6" className={styles.title}>
        Add Medical History for {patient?.name}
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} className={styles.formGrid}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Record ID"
              name="recordId"
              value={formData.recordId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Doctor Name"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Presenting Complaint"
              name="presentingComplaint"
              value={formData.presentingComplaint}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Family History"
              name="familyHistory"
              value={formData.familyHistory}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Social History"
              name="socialHistory"
              value={formData.socialHistory}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Past Medical History"
              name="pastMedicalHistory"
              value={formData.pastMedicalHistory}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
              Add Medical Record
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}