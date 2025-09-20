"use client";
import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Grid, Paper, Typography, Alert, Skeleton } from '@mui/material';
import axios from 'axios';
import styles from './PatientForm.module.css';

export default function PatientForm({ onSubmit, patient }) {
  const [formData, setFormData] = useState({
    email: patient?.user?.email || '',
    name: patient?.user?.name || '',
    password: '',
    patientId: patient?.patientId || '',
    dateOfBirth: patient?.dateOfBirth || '',
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
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = patient ? `/api/patient/${patient.id}` : '/api/patient';
      const method = patient ? axios.put : axios.post;
      await method(endpoint, formData);
      onSubmit();
      if (!patient) {
        setFormData({
          email: '',
          name: '',
          password: '',
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
        });
      }
      setError(null);
    } catch (error) {
      console.error(`Error ${patient ? 'updating' : 'creating'} patient:`, error);
      setError(error.response?.data?.error || `Failed to ${patient ? 'update' : 'create'} patient`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
      {loading ? (
        <Box className={styles.skeletonWrapper}>
          <Skeleton variant="rectangular" height={60} className={styles.skeleton} />
          <Skeleton variant="rectangular" height={400} className={styles.skeleton} />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box className={styles.toolbar}>
            <TextField
              label="Search Patient Details"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchField}
            />
            <TextField
              label="Filter by Gender"
              select
              variant="outlined"
              size="small"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className={styles.filterField}
            >
              <MenuItem value="">All Genders</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Box>
          <Grid container spacing={2} className={styles.formGrid}>
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
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                disabled={!!patient} // Disable password editing
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                fullWidth
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
              <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
                {patient ? 'Update Patient' : 'Add Patient'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
}