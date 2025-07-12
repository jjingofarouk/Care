import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography } from '@mui/material';
import { Save, Plane } from 'lucide-react';

const TravelHistoryForm = ({ initialData = {}, onSubmit, medicalRecords = [] }) => {
  const [formData, setFormData] = useState({
    medicalRecordId: initialData.medicalRecordId || '',
    countryVisited: initialData.countryVisited || '',
    dateFrom: initialData.dateFrom || '',
    dateTo: initialData.dateTo || '',
    purpose: initialData.purpose || '',
    travelNotes: initialData.travelNotes || '',
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
      <Typography variant="h6" className="card-title mb-4">Travel History</Typography>
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
            label="Country Visited"
            name="countryVisited"
            value={formData.countryVisited}
            onChange={handleChange}
            required
            className="input"
            InputProps={{
              startAdornment: <Plane className="h-5 w-5 mr-2 text-hospital-gray-500" />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date From"
            name="dateFrom"
            value={formData.dateFrom}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date To"
            name="dateTo"
            value={formData.dateTo}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="input"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Travel Notes"
            name="travelNotes"
            value={formData.travelNotes}
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
            Save Travel History
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TravelHistoryForm;