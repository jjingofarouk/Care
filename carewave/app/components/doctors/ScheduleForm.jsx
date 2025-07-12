import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function ScheduleForm({ schedule, doctors, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    doctorId: schedule?.doctorId || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    dayOfWeek: schedule?.dayOfWeek || '',
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
        name="startTime"
        label="Start Time"
        type="time"
        value={formData.startTime}
        onChange={handleChange}
        fullWidth
        className="input"
        required
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="endTime"
        label="End Time"
        type="time"
        value={formData.endTime}
        onChange={handleChange}
        fullWidth
        className="input"
        required
        InputLabelProps={{ shrink: true }}
      />
      <FormControl fullWidth className="select">
        <InputLabel>Day of Week</InputLabel>
        <Select
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          required
        >
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <MenuItem key={day} value={day}>{day}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          className="btn btn-primary"
        >
          {schedule ? 'Update' : 'Create'} Schedule
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