// app/adt/DischargeForm.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Grid, Paper, Typography, Box, Autocomplete } from '@mui/material';
import { createDischarge, updateDischarge, getPatients } from './adtService';

export default function DischargeForm({ discharge, onSubmit, doctors }) {
  const [formData, setFormData] = useState({
    patientId: discharge?.patientId || '',
    doctorId: discharge?.doctorId || '',
    dischargeDate: discharge?.dischargeDate ? new Date(discharge.dischargeDate).toISOString().split('T')[0] : '',
    dischargeNotes: discharge?.dischargeNotes || '',
    followUpInstructions: discharge?.followUpInstructions || '',
    medications: discharge?.medications || '',
  });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    fetchPatients();
    if (discharge?.id) {
      setFormData({
        patientId: discharge.patientId,
        doctorId: discharge.doctorId,
        dischargeDate: discharge.dischargeDate ? new Date(discharge.dischargeDate).toISOString().split('T')[0] : '',
        dischargeNotes: discharge.dischargeNotes || '',
        followUpInstructions: discharge.followUpInstructions || '',
        medications: discharge.medications || '',
      });
    }
  }, [discharge]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePatientSelect = (event, value) => {
    setFormData({ ...formData, patientId: value ? value.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (discharge?.id) {
        await updateDischarge(discharge.id, formData);
      } else {
        await createDischarge(formData);
      }
      onSubmit();
      setFormData({
        patientId: '',
        doctorId: '',
        dischargeDate: '',
        dischargeNotes: '',
        followUpInstructions: '',
        medications: '',
      });
    } catch (error) {
      console.error('Error submitting discharge:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {discharge?.id ? 'Update Discharge' : 'New Discharge'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.user.name} (${option.patientId})`}
                onChange={handlePatientSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Patient"
                    fullWidth
                    required
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Doctor"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                fullWidth
                required
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.user.name} ({doctor.specialty})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Discharge Date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Discharge Notes"
                name="dischargeNotes"
                value={formData.dischargeNotes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Follow-up Instructions"
                name="followUpInstructions"
                value={formData.followUpInstructions}
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
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {discharge?.id ? 'Update Discharge' : 'Add Discharge'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}