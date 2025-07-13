import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography, Switch } from '@mui/material';
import { Save, Pill } from 'lucide-react';

const MedicationHistoryForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    medicationName: initialData.medicationName || '',
    dosage: initialData.dosage || '',
    frequency: initialData.frequency || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    isCurrent: initialData.isCurrent || false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, isCurrent: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="card p-6">
      <Typography variant="h6" className="card-title mb-4">Medication History</Typography>
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
            label="Medication Name"
            name="medicationName"
            value={formData.medicationName}
            onChange={handleChange}
            required
            className="input"
            InputProps={{
              startAdornment: <Pill className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={formData.isCurrent}
            className="input"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isCurrent}
                onChange={handleSwitchChange}
                name="isCurrent"
                color="primary"
              />
            }
            label="Current Medication"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            className="btn-primary w-full sm:w-auto"
          >
            Save Medication
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedicationHistoryForm;