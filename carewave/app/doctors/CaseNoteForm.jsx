'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Autocomplete } from '@mui/material';


const CaseNoteForm = ({ onSave, onCancel, patients }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    note: '',
    visibility: 'PRIVATE',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option.user.name}
        onChange={(e, value) => setFormData({ ...formData, patientId: value?.id || '' })}
        renderInput={(params) => <TextField {...params} label="Patient" margin="normal" required />}
      />
      <TextField
        label="Note"
        name="note"
        value={formData.note}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        required
      />
      <TextField
        label="Visibility"
        name="visibility"
        value={formData.visibility}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['PRIVATE', 'SHARED'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          Add Case Note
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CaseNoteForm;
