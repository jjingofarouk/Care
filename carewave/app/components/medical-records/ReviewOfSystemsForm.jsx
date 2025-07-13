import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography } from '@mui/material';
import { Save, Stethoscope } from 'lucide-react';

const ReviewOfSystemsForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    system: initialData.system || '',
    findings: initialData.findings || '',
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
      <Typography variant="h6" className="card-title mb-4">Review of Systems</Typography>
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
          <FormControl fullWidth>
            <InputLabel>System</InputLabel>
            <Select
              name="system"
              value={formData.system}
              onChange={handleChange}
              required
              className="select"
              startAdornment={<Stethoscope className="h-5 w-5 mr-2 text-hospital-gray-500" />}
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Cardiovascular">Cardiovascular</MenuItem>
              <MenuItem value="Respiratory">Respiratory</MenuItem>
              <MenuItem value="Gastrointestinal">Gastrointestinal</MenuItem>
              <MenuItem value="Neurological">Neurological</MenuItem>
              <MenuItem value="Musculoskeletal">Musculoskeletal</MenuItem>
              <MenuItem value="Genitourinary">Genitourinary</MenuItem>
              <MenuItem value="Endocrine">Endocrine</MenuItem>
              <MenuItem value="Skin">Skin</MenuItem>
              <MenuItem value="Psychiatric">Psychiatric</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Findings"
            name="findings"
            value={formData.findings}
            onChange={handleChange}
            multiline
            rows={4}
            className="textarea"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            className="btn-primary w-full sm:w-auto"
          >
            Save Review
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewOfSystemsForm;