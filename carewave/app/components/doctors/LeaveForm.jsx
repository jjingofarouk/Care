import React from 'react';
import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function LeaveForm({ leave, doctors, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    doctorId: leave?.doctorId || '',
    startDate: leave?.startDate?.split('T')[0] || '',
    endDate: leave?.endDate?.split('T')[0] || '',
    reason: leave?.reason || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormControl fullWidth className="select">
        <InputLabel>Doctor</InputLabel>
        <Select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          {doctors.map(doctor => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.firstName} {doctor.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="startDate"
        label="Start Date"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        fullWidth
        className="input"
        required
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="endDate"
        label="End Date"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        fullWidth
        className="input"
        required
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="reason"
        label="Reason"
        value={formData.reason}
        onChange={handleChange}
        fullWidth
        className="input"
        multiline
        rows={4}
      />
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          className="btn btn-primary"
        >
          {leave ? 'Update' : 'Create'} Leave
        </Button>
        <Button
          type="button"
          variant="outlined"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}