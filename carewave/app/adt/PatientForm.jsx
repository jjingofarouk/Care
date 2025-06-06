"use client";
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Grid, Paper, Typography, Alert, Skeleton } from '@mui/material';
import axios from 'axios';
import styles from './PatientForm.module.css';

export default function PatientForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicy: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    // Simulate loading delay for skeleton
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
      await axios.post('/api/patient', formData);
      onSubmit();
      setFormData({
        email: '',
        name: '',
        password: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        address: '',
        emergencyContact: '',
        emergencyContactPhone: '',
        insuranceProvider: '',
        insurancePolicy: '',
      });
      setError(null);
    } catch (error) {
      console.error('Error creating patient:', error);
      setError(error.response?.data?.error || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Optional: Add logic to filter form fields or trigger API search
  };

  return (
    <Paper className={styles.paper}>
      <Typography variant="h6" className={styles.title}>
        Add New Patient
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
                required
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
                required
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
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
                Add Patient
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
}