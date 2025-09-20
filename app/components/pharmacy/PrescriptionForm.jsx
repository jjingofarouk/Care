'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, FormControl, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import pharmacyService from '../../services/pharmacyService';

export default function PrescriptionForm({ prescription }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: prescription?.id || '',
    patientId: prescription?.patientId || '',
    doctorId: prescription?.doctorId || '',
    drugId: prescription?.drugId || '',
    dosage: prescription?.dosage || '',
    prescribedAt: prescription?.prescribedAt ? 
      new Date(prescription.prescribedAt).toISOString().slice(0, 16) : 
      new Date().toISOString().slice(0, 16),
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, doctorData, drugData] = await Promise.all([
          pharmacyService.getPatients(),
          pharmacyService.getDoctors(),
          pharmacyService.getDrugs()
        ]);
        setPatients(patientData);
        setDoctors(doctorData);
        setDrugs(drugData);
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
      const method = prescription?.id ? 'PUT' : 'POST';
      await pharmacyService.createPrescription({
        ...formData,
        method
      });
      
      router.push('/prescriptions');
    } catch (err) {
      console.error('Error saving prescription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && !patients.length && !doctors.length && !drugs.length) {
    return (
      <div className="card max-w-full mx-auto p-4">
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
    <div className="card max-w-full mx-auto p-4">
      <Typography variant="h5" className="card-title mb-4 font-bold">
        {prescription?.id ? 'Edit Prescription' : 'New Prescription'}
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
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <Autocomplete
            options={drugs}
            getOptionLabel={(option) => option.name || ''}
            onChange={(e, value) => handleAutocompleteChange('drugId', value)}
            value={drugs.find(d => d.id === formData.drugId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Drug"
                required
                className="input"
              />
            )}
          />
        </FormControl>

        <TextField
          name="dosage"
          label="Dosage"
          value={formData.dosage}
          onChange={handleChange}
          className="input"
          fullWidth
          required
        />

        <TextField
          name="prescribedAt"
          label="Prescribed At"
          type="datetime-local"
          value={formData.prescribedAt}
          onChange={handleChange}
          className="input"
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Box className="flex justify-end gap-2 mt-6">
          <Button
            variant="outlined"
            className="btn-secondary"
            onClick={() => router.push('/prescriptions')}
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
            {loading ? 'Saving...' : (prescription?.id ? 'Update' : 'Create')}
          </Button>
        </Box>
      </form>
    </div>
  );
}