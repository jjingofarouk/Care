'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import medicalRecordsService from '../../services/medicalRecordsService';

export default function MedicalRecordForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    patientId: '',
    recordDate: '',
    ...initialData
  });
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <FormControl fullWidth>
        <InputLabel>Patient</InputLabel>
        <Select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          label="Patient"
        >
          {patients.map(patient => (
            <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        name="recordDate"
        label="Record Date"
        type="date"
        value={formData.recordDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <Button type="submit" variant="contained">Save</Button>
      <Button variant="outlined" onClick={() => onSubmit(null)}>Cancel</Button>
    </Box>
  );
}