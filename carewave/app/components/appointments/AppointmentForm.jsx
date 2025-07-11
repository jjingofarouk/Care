'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box, Typography, CircularProgress, Autocomplete } from '@mui/material';
import { Calendar, User, Stethoscope } from 'lucide-react';
import { getPatients, getDoctors, getVisitTypes, createAppointment, updateAppointment } from '@/services/appointmentService';
import { useRouter } from 'next/navigation';

export default function AppointmentForm({ appointment }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    visitTypeId: appointment?.visitTypeId || '',
    appointmentDate: appointment?.appointmentDate ? new Date(appointment.appointmentDate).toISOString().slice(0, 16) : '',
    status: appointment?.appointmentStatus || 'PENDING',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [visitTypes, setVisitTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, doctorData, visitTypeData] = await Promise.all([
          getPatients(),
          getDoctors(),
          getVisitTypes(),
        ]);
        setPatients(patientData);
        setDoctors(doctorData);
        setVisitTypes(visitTypeData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData({ ...formData, [name]: value ? value.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (appointment?.id) {
        await updateAppointment(appointment.id, formData);
      } else {
        await createAppointment({ ...formData, bookedById: 'user-id-placeholder' });
      }
      router.push('/appointments');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <Typography variant="h5" className="card-title">
        {appointment?.id ? 'Edit Appointment' : 'New Appointment'}
      </Typography>
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormControl fullWidth>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => handleAutocompleteChange('patientId', value)}
            value={patients.find(p => p.id === formData.patientId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                className="input"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <User className="mr-2" size={20} />,
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => `Dr. ${option.name} (${option.department?.name})`}
            onChange={(e, value) => handleAutocompleteChange('doctorId', value)}
            value={doctors.find(d => d.id === formData.doctorId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Doctor"
                className="input"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <Stethoscope className="mr-2" size={20} />,
                }}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Visit Type</InputLabel>
          <Select
            name="visitTypeId"
            value={formData.visitTypeId}
            onChange={handleChange}
            className="select"
            required
          >
            {visitTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="appointmentDate"
          type="datetime-local"
          value={formData.appointmentDate}
          onChange={handleChange}
          className="input"
          required
          InputProps={{
            startAdornment: <Calendar className="mr-2" size={20} />,
          }}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select"
            required
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <Box className="flex justify-end gap-2">
          <Button
            variant="outlined"
            className="btn-secondary"
            onClick={() => router.push('/appointments')}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="btn-primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {appointment?.id ? 'Update' : 'Create'}
          </Button>
        </Box>
      </form>
    </div>
  );
}