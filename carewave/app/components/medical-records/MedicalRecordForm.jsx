import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography } from '@mui/material';
import { Calendar, User, Save } from 'lucide-react';

const MedicalRecordForm = ({ initialData = {}, onSubmit, patients = [] }) => {
  const [formData, setFormData] = useState({
    patientId: initialData.patientId || '',
    recordDate: initialData.recordDate || new Date().toISOString().split('T')[0],
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
      <Typography variant="h6" className="card-title mb-4">Medical Record Details</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Patient</InputLabel>
            <Select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="select"
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Record Date"
            name="recordDate"
            value={formData.recordDate}
            onChange={handleChange}
            required
            className="input"
            InputProps={{
              startAdornment: <Calendar className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            className="btn-primary w-full sm:w-auto"
          >
            Save Medical Record
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedicalRecordForm;