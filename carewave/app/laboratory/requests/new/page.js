
'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, Box, Typography, Autocomplete } from '@mui/material';
import { Save, X, Calendar, User, TestTube, FlaskConical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createLabRequest biologyService';

export default function LabRequestNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    labTestId: '',
    sampleId: '',
    requestedAt: new Date().toISOString().slice(0, 16),
  });
  const [patients, setPatients] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [labTestSearch, setLabTestSearch] = useState('');
  const [sampleSearch, setSampleSearch] = useState('');

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedPatientSearch = useDebounce(patientSearch, 300);
  const debouncedLabTestSearch = useDebounce(labTestSearch, 300);
  const debouncedSampleSearch = useDebounce(sampleSearch, 300);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await getPatients(debouncedPatientSearch);
        setPatients(response.map(p => ({
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          firstName: p.firstName,
          lastName: p.lastName
        })));
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    }
    fetchPatients();
  }, [debouncedPatientSearch]);

  useEffect(() => {
    async function fetchLabTests() {
      try {
        const response = await getLabTests(debouncedLabTestSearch);
        setLabTests(response);
      } catch (err) {
        console.error('Error fetching lab tests:', err);
      }
    }
    fetchLabTests();
  }, [debouncedLabTestSearch]);

  useEffect(() => {
    async function fetchSamples() {
      try {
        const response = await getSamples(debouncedSampleSearch);
        setSamples(response.map(s => ({
          id: s.id,
          sampleType: `${s.sampleType} - ${s.patient.firstName} ${s.patient.lastName}`,
          originalSampleType: s.sampleType,
          collectedAt: s.collectedAt,
          patientName: `${s.patient.firstName} ${s.patient.lastName}`
        })));
      } catch (err) {
        console.error('Error fetching samples:', err);
      }
    }
    fetchSamples();
  }, [debouncedSampleSearch]);

  const handleAutocompleteChange = (name, value) => {
    setFormData({ ...formData, [name]: value ? value.id : '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createLabRequest({
        patientId: formData.patientId,
        labTestId: formData.labTestId,
        sampleId: formData.sampleId || null,
        requestedAt: formData.requestedAt,
      });
      router.push('/laboratory/requests');
    } catch (err) {
      setError('Failed to create lab request');
      console.error('Error creating lab request:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error && !patients.length && !labTests.length && !samples.length) {
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
        New Lab Request
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
            onInputChange={(event, newInputValue) => setPatientSearch(newInputValue)}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient"
                required
                className="input"
                placeholder="Type to search patients..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <User className="h-4 w-4 mr-2 text-[var(--hospital-accent)]" />
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
            options={labTests}
            getOptionLabel={(option) => option.name || ''}
            onChange={(e, value) => handleAutocompleteChange('labTestId', value)}
            value={labTests.find(t => t.id === formData.labTestId) || null}
            onInputChange={(event, newInputValue) => setLabTestSearch(newInputValue)}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lab Test"
                required
                className="input"
                placeholder="Type to search lab tests..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <TestTube className="h-4 w-4 mr-2 text-[var(--hospital-accent)]" />
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
            options={samples}
            getOptionLabel={(option) => option.sampleType || ''}
            onChange={(e, value) => handleAutocompleteChange('sampleId', value)}
            value={samples.find(s => s.id === formData.sampleId) || null}
            onInputChange={(event, newInputValue) => setSampleSearch(newInputValue)}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sample"
                className="input"
                placeholder="Type to search samples..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <FlaskConical className="h-4 w-4 mr-2 text-[var(--hospital-accent)]" />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </FormControl>

        <TextField
          name="requestedAt"
          label="Requested At"
          type="datetime-local"
          value={formData.requestedAt}
          onChange={handleChange}
          className="input"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <Calendar className="h-4 w-4 mr-2 text-[var(--hospital-accent)]" />,
          }}
        />

        <Box className="flex justify-end gap-2 mt-6">
          <Button
            variant="outlined"
            className="btn-secondary"
            onClick={() => router.push('/laboratory/requests')}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="contained"
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </Box>
      </form>
    </div>
  );
}
