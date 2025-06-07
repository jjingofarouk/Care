"use client";
import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid, Paper, Typography, Alert } from '@mui/material';
import { createPatient, updatePatient } from './patientService';
import styles from './PatientForm.module.css';

export default function PatientForm({ patient, onSubmit }) {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    patientId: patient?.patientId || '',
    dateOfBirth: patient?.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
    gender: patient?.gender || '',
    phone: patient?.phone || '',
    address: patient?.address || '',
    emergencyContact: patient?.emergencyContact || '',
    emergencyContactPhone: patient?.emergencyContactPhone || '',
    insuranceProvider: patient?.insuranceProvider || '',
    insurancePolicy: patient?.insurancePolicy || '',
    bloodType: patient?.bloodType || '',
    allergies: patient?.allergies || '',
    medicalHistory: patient?.medicalHistory || '',
    presentingComplaint: patient?.presentingComplaint || '',
    familyHistory: patient?.familyHistory || '',
    socialHistory: patient?.socialHistory || '',
    pastMedicalHistory: patient?.pastMedicalHistory || '',
    medications: patient?.medications || '',
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
      if (patient) {
        await updatePatient(patient.id, formData);
      } else {
        await createPatient(formData);
      }
      onSubmit();
      if (!patient) {
        setFormData({
          name: '',
          email: '',
          patientId: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          address: '',
          emergencyContact: '',
          emergencyContactPhone: '',
          insuranceProvider: '',
          insurancePolicy: '',
          bloodType: '',
          allergies: '',
          medicalHistory: '',
          presentingComplaint: '',
          familyHistory: '',
          socialHistory: '',
          pastMedicalHistory: '',
          medications: '',
        });
      }
      setError(null);
    } catch (error) {
      console.error(`Error ${patient ? 'updating' : 'creating'} patient:`, error);
      setError(error.response?.data?.details || error.message);
    }
  };

  return (
    <Paper className={styles.paper}>
      <Typography variant="h6" className={styles.title}>
        {patient ? 'Edit Patient' : 'Add New Patient'}
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
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Insurance Policy"
              name="insurancePolicy"
              value={formData.insurancePolicy}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Blood Type"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              fullWidth
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
              label="Medical History"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
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
              {patient ? 'Update Patient' : 'Add Patient'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}