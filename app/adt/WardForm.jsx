"use client";
import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, Alert } from '@mui/material';
import axios from 'axios';

export default function WardForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    totalBeds: '',
    department: '',
    location: '',
    nurseInCharge: '',
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
      await axios.post('/api/ward', formData);
      onSubmit();
      setFormData({
        name: '',
        totalBeds: '',
        department: '',
        location: '',
        nurseInCharge: '',
      });
      setError(null);
    } catch (error) {
      console.error('Error creating ward:', error);
      setError(error.response?.data?.error || 'Failed to create ward');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Ward</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Beds"
              name="totalBeds"
              type="number"
              value={formData.totalBeds}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nurse In Charge"
              name="nurseInCharge"
              value={formData.nurseInCharge}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Ward
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}