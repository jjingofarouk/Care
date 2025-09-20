import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography } from '@mui/material';
import { Save, Thermometer } from 'lucide-react';

const VitalSignForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    bloodPressure: initialData.bloodPressure || '',
    heartRate: initialData.heartRate || '',
    temperature: initialData.temperature || '',
    respiratoryRate: initialData.respiratoryRate || '',
    oxygenSaturation: initialData.oxygenSaturation || '',
    recordedAt: initialData.recordedAt || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="card p-6">
      <Typography variant="h6" className="card-title mb-4">Vital Signs</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Medical Record</InputLabel>
            <Select
              name="medicalRecordId"
              value={formData.medicalRecordId}
              onChange={handleChange}
              required
              className="select"
            >
              {medicalRecords.map((record) => (
                <MenuItem key={record.id} value={record.id}>
                  Record {record.id} - {record.patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Blood Pressure"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Heart Rate (bpm)"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Temperature (°C)"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="input"
            InputProps={{
              startAdornment: <Thermometer className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Respiratory Rate (bpm)"
            name="respiratoryRate"
            value={formData.respiratoryRate}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Oxygen Saturation (%)"
            name="oxygenSaturation"
            value={formData.oxygenSaturation}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Recorded Date"
            name="recordedAt"
            value={formData.recordedAt}
            onChange={handleChange}
            required
            className="input"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            className="btn-primary w-full sm:w-auto"
          >
            Save Vital Signs
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VitalSignForm;