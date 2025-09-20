"use client";
import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, Alert } from '@mui/material';
import axios from 'axios';

export default function DoctorForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    specialty: '',
    licenseNumber: '',
    phone: '',
    office: '',
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
      await axios.post('/api/doctor', formData);
      onSubmit();
      setFormData({
        email: '',
        name: '',
        password: '',
        specialty: '',
        licenseNumber: '',
        phone: '',
        office: '',
      });
      setError(null);
    } catch (error) {
      console.error('Error creating doctor:', error);
      setError(error.response?.data?.error || 'Failed to create doctor');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Doctor</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              fullWidth
              required
            />
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="Office"
              name="office"
              value={formData.office}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Doctor
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}