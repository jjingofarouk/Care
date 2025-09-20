'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Autocomplete } from '@mui/material';

const PrescriptionForm = ({ onSave, onCancel, patients }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    drugs: [],
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDrugChange = (event, value) => {
    setFormData({ ...formData, drugs: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const drugOptions = ['Aspirin 75mg', 'Paracetamol 500mg', 'Amoxicillin 500mg', 'Metformin 500mg'];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option.user.name}
        onChange={(e, value) => setFormData({ ...formData, patientId: value?.id || '' })}
        renderInput={(params) => <TextField {...params} label="Patient" margin="normal" required />}
      />
      <Autocomplete
        multiple
        options={drugOptions}
        onChange={handleDrugChange}
        renderInput={(params) => <TextField {...params} label="Drugs" margin="normal" />}
      />
      <TextField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          Add Prescription
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default PrescriptionForm;
