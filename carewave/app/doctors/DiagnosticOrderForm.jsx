'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Autocomplete } from '@mui/material';


const DiagnosticOrderForm = ({ onSave, onCancel, patients }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    test: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const testOptions = ['ECG', 'X-Ray', 'Blood Test', 'Ultrasound', 'CT Scan'];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option.user.name}
        onChange={(e, value) => setFormData({ ...formData, patientId: value?.id || '' })}
        renderInput={(params) => <TextField {...params} label="Patient" margin="normal" required />}
      />
      <Autocomplete
        options={testOptions}
        onChange={(e, value) => setFormData({ ...formData, test: value || '' })}
        renderInput={(params) => <TextField {...params} label="Test" margin="normal" required />}
      />
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          Add Diagnostic Order
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DiagnosticOrderForm;
