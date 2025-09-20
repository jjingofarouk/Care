import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography } from '@mui/material';
import { Save, Users } from 'lucide-react';

const FamilyHistoryForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    relative: initialData.relative || '',
    condition: initialData.condition || '',
    ageAtDiagnosis: initialData.ageAtDiagnosis || '',
    notes: initialData.notes || '',
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
      <Typography variant="h6" className="card-title mb-4">Family History</Typography>
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
            label="Relative"
            name="relative"
            value={formData.relative}
            onChange={handleChange}
            required
            className="input"
            InputProps={{
              startAdornment: <Users className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Age at Diagnosis"
            name="ageAtDiagnosis"
            value={formData.ageAtDiagnosis}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
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
            Save Family History
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FamilyHistoryForm;