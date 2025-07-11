'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Clipboard } from 'lucide-react';

export default function AppointmentForm({
  onSubmit,
  initialData = {},
  patients = [],
  doctors = [],
  departments = [],
}) {
  const [form, setForm] = useState({
    patientId: initialData.patientId || '',
    doctorId: initialData.doctorId || '',
    departmentId: initialData.departmentId || '',
    reason: initialData.reason || '',
    visitType: initialData.visitType || '',
    scheduledAt: initialData.scheduledAt || '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6" className="flex items-center gap-2">
        <Clipboard size={20} /> Appointment Details
      </Typography>

      <Stack spacing={2}>
        <TextField
          select
          label="Patient"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          fullWidth
          required
        >
          {patients.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Doctor"
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          fullWidth
          required
        >
          {doctors.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              Dr. {d.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Department"
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          fullWidth
          required
        >
          {departments.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
              {dep.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Visit Type"
          name="visitType"
          value={form.visitType}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          required
        />

        <TextField
          label="Scheduled At"
          name="scheduledAt"
          type="datetime-local"
          value={form.scheduledAt}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          required
        />

        <Button variant="contained" color="primary" type="submit">
          Save Appointment
        </Button>
      </Stack>
    </Box>
  );
}