'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

export default function PrescriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prescriptionId = searchParams.get('id');
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    drugId: '',
    dosage: '',
    prescribedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResources();
    if (prescriptionId) {
      fetchPrescription();
    }
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [patientsRes, doctorsRes, drugsRes] = await Promise.all([
        fetch('/api/pharmacy/prescriptions?resource=patients', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/pharmacy/prescriptions?resource=doctors', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/pharmacy/prescriptions?resource=drugs', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      if (!patientsRes.ok || !doctorsRes.ok || !drugsRes.ok) {
        throw new Error('Failed to fetch resources');
      }

      const [patientsData, doctorsData, drugsData] = await Promise.all([
        patientsRes.json(),
        doctorsRes.json(),
        drugsRes.json(),
      ]);

      setPatients(patientsData);
      setDoctors(doctorsData);
      setDrugs(drugsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/prescriptions?id=${prescriptionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFormData({
        patientId: data.patientId || '',
        doctorId: data.doctorId || '',
        drugId: data.drugId || '',
        dosage: data.dosage || '',
        prescribedAt: data.prescribedAt ? format(new Date(data.prescribedAt), 'yyyy-MM-dd\'T\'HH:mm') : '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = prescriptionId ? `/api/pharmacy/prescriptions` : '/api/pharmacy/prescriptions';
      const method = prescriptionId ? 'PUT' : 'POST';
      const body = prescriptionId ? { ...formData, id: prescriptionId } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      router.push('/pharmacy/prescriptions');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="card w-full max-w-3xl mx-auto mt-8 p-6">
        <Typography color="error" className="mb-4">
          Error: {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/pharmacy/prescriptions')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Back to Prescriptions
        </Button>
      </Box>
    );
  }

  return (
    <Box className="card w-full max-w-3xl mx-auto mt-8 p-6">
      <Typography variant="h4" className="mb-6 text-[var(--hospital-gray-900)]">
        {prescriptionId ? 'Edit Prescription' : 'New Prescription'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        <FormControl fullWidth>
          <InputLabel>Patient</InputLabel>
          <Select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Doctor</InputLabel>
          <Select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {`Dr. ${doctor.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Drug</InputLabel>
          <Select
            name="drugId"
            value={formData.drugId}
            onChange={handleChange}
            required
          >
            {drugs.map((drug) => (
              <MenuItem key={drug.id} value={drug.id}>
                {drug.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Dosage"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          label="Prescribed At"
          name="prescribedAt"
          type="datetime-local"
          value={formData.prescribedAt}
          onChange={handleChange}
          required
        />

        <Box className="flex gap-4">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Saving...' : 'Save Prescription'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/pharmacy/prescriptions')}
            className="border-[var(--hospital-gray-300)] text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-50)]"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}