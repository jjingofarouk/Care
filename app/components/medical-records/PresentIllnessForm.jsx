import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography } from '@mui/material';
import { Save, FileText } from 'lucide-react';

const PresentIllnessForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    narrative: initialData.narrative || '',
    severity: initialData.severity || '',
    progress: initialData.progress || '',
    associatedSymptoms: initialData.associatedSymptoms || '',
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
      <Typography variant="h6" className="card-title mb-4">Present Illness</Typography>
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Narrative"
            name="narrative"
            value={formData.narrative}
            onChange={handleChange}
            required
            multiline
            rows={4}
            className="textarea"
            InputProps={{
              startAdornment: <FileText className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Progress"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Associated Symptoms"
            name="associatedSymptoms"
            value={formData.associatedSymptoms}
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
            Save Present Illness
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PresentIllnessForm;