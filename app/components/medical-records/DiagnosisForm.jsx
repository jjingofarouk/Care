import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Save, Stethoscope } from 'lucide-react';

const DiagnosisForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    code: initialData.code || '',
    description: initialData.description || '',
    diagnosedAt: initialData.diagnosedAt || new Date().toISOString().split('T')[0],
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
      <Typography variant="h6" className="card-title mb-4">Diagnosis Details</Typography>
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
            label="Diagnosis Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="input"
            InputProps={{
              startAdornment: <Stethoscope className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={3}
            className="textarea"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Diagnosed Date"
            name="diagnosedAt"
            value={formData.diagnosedAt}
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
            Save Diagnosis
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DiagnosisForm;