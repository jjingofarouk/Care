'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';


const ScheduleForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    location: '',
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
      <TextField
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        label="Time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['08:00-11:00', '11:00-14:00', '14:00-17:00', '17:00-20:00', '20:00-23:00'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Consultation', 'Surgery', 'Rounds', 'On-Call', 'Meeting'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Ward A', 'Ward B', 'Ward C', 'ICU', 'Theatre 1', 'Theatre 2', 'OPD Clinic'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          Add Schedule
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ScheduleForm;
