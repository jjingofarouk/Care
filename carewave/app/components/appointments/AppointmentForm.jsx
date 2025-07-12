'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box, Typography, Autocomplete } from '@mui/material';
import { Calendar, User, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AppointmentForm({ appointment }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: appointment?.patientId || '',
    doctorId: appointment?.doctorId || '',
    visitTypeId: appointment?.visitTypeId || '',
    appointmentDate: appointment?.appointmentDate ? 
      new Date(appointment.appointmentDate).toISOString().slice(0, 16) : '',
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
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [patientRes, doctorRes, visitTypeRes] = await Promise.all([
          fetch('/api/appointments?resource=patients', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/appointments?resource=doctors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/appointments?resource=visitTypes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!patientRes.ok || !doctorRes.ok || !visitTypeRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [patientData, doctorData, visitTypeData] = await Promise.all([
          patientRes.json(),
          doctorRes.json(),
          visitTypeRes.json(),
        ]);

        setPatients(patientData);
        setDoctors(doctorData);
        setVisitTypes(visitTypeData);
      } catch (err) {
        console.error('Error fetching data:', err);
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
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const method = appointment?.id ? 'PUT' : 'POST';
      const url = '/api/appointments';
      
      const body = appointment?.id 
        ? { 
            id: appointment.id,
            patientId: formData.patientId,
            doctorId: formData.doctorId,
            visitTypeId: formData.visitTypeId,
            appointmentDate: formData.appointmentDate,
            status: formData.status,
          }
        : { 
            resource: 'appointment',
            patientId: formData.patientId,
            doctorId: formData.doctorId,
            visitTypeId: formData.visitTypeId,
            appointmentDate: formData.appointmentDate,
            status: formData.status,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save appointment');
      }

      router.push('/appointments');
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && !patients.length && !doctors.length && !visitTypes.length) {
    return (
      <div className="card p-4">
        <div className="alert alert-error mb-2">
          <span>Error loading form data: {error}</span>
        </div>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <Typography variant="h5" className="card-title mb-4">
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
            getOptionLabel={(option) => option.name || ''}
            onChange={(e, value) => handleAutocompleteChange('patientId', value)}
            value={patients.find(p => p.id === formData.patientId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                required
                className="input"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <User className="mr-2" size={16} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => 
              option.department?.name 
                ? `Dr. ${option.name} (${option.department.name})`
                : `Dr. ${option.name}`
            }
            onChange={(e, value) => handleAutocompleteChange('doctorId', value)}
            value={doctors.find(d => d.id === formData.doctorId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Doctor"
                required
                className="input"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Stethoscope className="mr-2" size={16} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
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
            label="Visit Type"
            className="select"
            required
          >
            <MenuItem value="">Select Visit Type</MenuItem>
            {visitTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="appointmentDate"
          label="Appointment Date"
          type="datetime-local"
          value={formData.appointmentDate}
          onChange={handleChange}
          className="input"
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: <Calendar className="mr-2" size={16} />,
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
            className="select"
            required
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>

        <Box className="flex justify-end gap-2 mt-6">
          <Button
            variant="outlined"
            className="btn-secondary"
            onClick={() => router.push('/appointments')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (appointment?.id ? 'Update' : 'Create')}
          </Button>
        </Box>
      </form>
    </div>
  );
}