'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Autocomplete, Typography } from '@mui/material';
import { X, Save, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MedicalRecordForm = ({ initialData, medicalRecord, token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {});
  const [resourceType, setResourceType] = useState(medicalRecord?.resource || 'medicalRecord');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error('No authentication token provided');

        const [patientRes, doctorRes] = await Promise.all([
          fetch('/api/medical-records?resource=patients', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/medical-records?resource=doctors', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!patientRes.ok || !doctorRes.ok) throw new Error('Failed to fetch data');

        const [patientData, doctorData] = await Promise.all([patientRes.json(), doctorRes.json()]);
        setPatients(patientData);
        setDoctors(doctorData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData({ ...formData, [name]: value ? value.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!token) throw new Error('No authentication token provided');

      const method = medicalRecord?.id ? 'PUT' : 'POST';
      const url = medicalRecord?.id ? `/api/medical-records/${medicalRecord.id}` : '/api/medical-records';
      const body = medicalRecord?.id ? { id: medicalRecord.id, resource: resourceType, ...formData } : { resource: resourceType, ...formData };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save record');
      }

      router.push('/medical-records');
    } catch (err) {
      console.error('Error saving record:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resourceFields = {
    medicalRecord: (
      <>
        <FormControl fullWidth className="mb-4">
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => option.name || ''}
            onChange={(e, value) => handleAutocompleteChange('patientId', value)}
            value={patients.find(p => p.id === formData.patientId) || null}
            renderInput={(params) => (
              <TextField {...params} label="Patient" required className="input" />
            )}
          />
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => `Dr. ${option.name} (${option.department?.name || 'N/A'})`}
            onChange={(e, value) => handleAutocompleteChange('doctorId', value)}
            value={doctors.find(d => d.id === formData.doctorId) || null}
            renderInput={(params) => (
              <TextField {...params} label="Doctor" required className="input" InputProps={{ ...params.InputProps, startAdornment: <Stethoscope className="h-4 w-4 mr-2" /> }} />
            )}
          />
        </FormControl>
        <TextField
          label="Record Date"
          name="recordDate"
          type="date"
          value={formData.recordDate || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
          InputLabelProps={{ shrink: true }}
          required
        />
      </>
    ),
    allergy: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Allergy Name" name="name" value={formData.name || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <FormControl fullWidth className="mb-4">
          <InputLabel>Severity</InputLabel>
          <Select name="severity" value={formData.severity || ''} onChange={handleChange} className="input" required>
            <MenuItem value="mild">Mild</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="severe">Severe</MenuItem>
          </Select>
        </FormControl>
      </>
    ),
    diagnosis: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Code" name="code" value={formData.code || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Description" name="description" value={formData.description || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Diagnosed At" name="diagnosedAt" type="date" value={formData.diagnosedAt || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} required />
      </>
    ),
    vitalSign: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Blood Pressure" name="bloodPressure" value={formData.bloodPressure || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Heart Rate" name="heartRate" type="number" value={formData.heartRate || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Temperature" name="temperature" type="number" value={formData.temperature || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Respiratory Rate" name="respiratoryRate" type="number" value={formData.respiratoryRate || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Oxygen Saturation" name="oxygenSaturation" type="number" value={formData.oxygenSaturation || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Recorded At" name="recordedAt" type="date" value={formData.recordedAt || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} required />
      </>
    ),
    chiefComplaint: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Description" name="description" value={formData.description || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Duration" name="duration" value={formData.duration || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Onset" name="onset" value={formData.onset || ''} onChange={handleChange} fullWidth className="input mb-4" />
      </>
    ),
    presentIllness: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Narrative" name="narrative" value={formData.narrative || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" required />
        <FormControl fullWidth className="mb-4">
          <InputLabel>Severity</InputLabel>
          <Select name="severity" value={formData.severity || ''} onChange={handleChange} className="input">
            <MenuItem value="mild">Mild</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="severe">Severe</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Progress" name="progress" value={formData.progress || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Associated Symptoms" name="associatedSymptoms" value={formData.associatedSymptoms || ''} onChange={handleChange} fullWidth className="input mb-4" />
      </>
    ),
    pastCondition: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Condition" name="condition" value={formData.condition || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Diagnosis Date" name="diagnosisDate" type="date" value={formData.diagnosisDate || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} />
        <TextField label="Notes" name="notes" value={formData.notes || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" />
      </>
    ),
    surgicalHistory: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Procedure" name="procedure" value={formData.procedure || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Date Performed" name="datePerformed" type="date" value={formData.datePerformed || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} />
        <TextField label="Outcome" name="outcome" value={formData.outcome || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Notes" name="notes" value={formData.notes || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" />
      </>
    ),
    familyHistory: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Relative" name="relative" value={formData.relative || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Condition" name="condition" value={formData.condition || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Age at Diagnosis" name="ageAtDiagnosis" type="number" value={formData.ageAtDiagnosis || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Notes" name="notes" value={formData.notes || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" />
      </>
    ),
    medicationHistory: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Medication Name" name="medicationName" value={formData.medicationName || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Dosage" name="dosage" value={formData.dosage || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Frequency" name="frequency" value={formData.frequency || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Start Date" name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} />
        <TextField label="End Date" name="endDate" type="date" value={formData.endDate || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} />
        <FormControl fullWidth className="mb-4">
          <InputLabel>Current</InputLabel>
          <Select name="isCurrent" value={formData.isCurrent || false} onChange={handleChange} className="input">
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
      </>
    ),
    socialHistory: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <FormControl fullWidth className="mb-4">
          <InputLabel>Smoking Status</InputLabel>
          <Select name="smokingStatus" value={formData.smokingStatus || ''} onChange={handleChange} className="input">
            <MenuItem value="never">Never</MenuItem>
            <MenuItem value="former">Former</MenuItem>
            <MenuItem value="current">Current</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel>Alcohol Use</InputLabel>
          <Select name="alcoholUse" value={formData.alcoholUse || ''} onChange={handleChange} className="input">
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="occasional">Occasional</MenuItem>
            <MenuItem value="regular">Regular</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Occupation" name="occupation" value={formData.occupation || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <FormControl fullWidth className="mb-4">
          <InputLabel>Marital Status</InputLabel>
          <Select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} className="input">
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="married">Married</MenuItem>
            <MenuItem value="divorced">Divorced</MenuItem>
            <MenuItem value="widowed">Widowed</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Living Situation" name="livingSituation" value={formData.livingSituation || ''} onChange={handleChange} fullWidth className="input mb-4" />
      </>
    ),
    reviewOfSystems: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="System" name="system" value={formData.system || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Findings" name="findings" value={formData.findings || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" required />
      </>
    ),
    immunization: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Vaccine" name="vaccine" value={formData.vaccine || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Date Given" name="dateGiven" type="date" value={formData.dateGiven || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} required />
        <TextField label="Administered By" name="administeredBy" value={formData.administeredBy || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Notes" name="notes" value={formData.notes || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" />
      </>
    ),
    travelHistory: (
      <>
        <TextField label="Medical Record ID" name="medicalRecordId" value={formData.medicalRecordId || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Country Visited" name="countryVisited" value={formData.countryVisited || ''} onChange={handleChange} fullWidth className="input mb-4" required />
        <TextField label="Date From" name="dateFrom" type="date" value={formData.dateFrom || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} />
        <TextField label="Date To" name="dateTo" type="date" value={formData.dateTo || ''} onChange={handleChange} fullWidth className="input mb-4" InputLabelProps={{ shrink: true }} />
        <TextField label="Purpose" name="purpose" value={formData.purpose || ''} onChange={handleChange} fullWidth className="input mb-4" />
        <TextField label="Notes" name="travelNotes" value={formData.travelNotes || ''} onChange={handleChange} fullWidth multiline rows={4} className="input mb-4" />
      </>
    )
  };

  if (error && !patients.length && !doctors.length) {
    return (
      <Box className="card max-w-full mx-auto p-4">
        <div className="alert alert-error mb-2">{error}</div>
        <Button variant="outlined" onClick={() => router.refresh()} className="btn-secondary">Retry</Button>
      </Box>
    );
  }

  return (
    <Box className="card max-w-full mx-auto p-4">
      <Typography variant="h5" className="card-title mb-4 font-bold">{medicalRecord?.id ? 'Edit Record' : 'New Record'}</Typography>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        <FormControl fullWidth className="mb-4">
          <InputLabel>Record Type</InputLabel>
          <Select value={resourceType} onChange={(e) => setResourceType(e.target.value)} className="input" required>
            <MenuItem value="medicalRecord">Medical Record</MenuItem>
            <MenuItem value="allergy">Allergy</MenuItem>
            <MenuItem value="diagnosis">Diagnosis</MenuItem>
            <MenuItem value="vitalSign">Vital Sign</MenuItem>
            <MenuItem value="chiefComplaint">Chief Complaint</MenuItem>
            <MenuItem value="presentIllness">Present Illness</MenuItem>
            <MenuItem value="pastCondition">Past Condition</MenuItem>
            <MenuItem value="surgicalHistory">Surgical History</MenuItem>
            <MenuItem value="familyHistory">Family History</MenuItem>
            <MenuItem value="medicationHistory">Medication History</MenuItem>
            <MenuItem value="socialHistory">Social History</MenuItem>
            <MenuItem value="reviewOfSystems">Review of Systems</MenuItem>
            <MenuItem value="immunization">Immunization</MenuItem>
            <MenuItem value="travelHistory">Travel History</MenuItem>
          </Select>
        </FormControl>
        {resourceFields[resourceType]}
        <Box className="flex gap-2">
          <Button type="submit" variant="contained" className="btn-primary flex-1" startIcon={<Save />} disabled={loading}>
            {loading ? 'Saving...' : (medicalRecord?.id ? 'Update' : 'Create')}
          </Button>
          <Button variant="outlined" className="btn-outline" onClick={() => setFormData({})} startIcon={<X />}>Clear</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MedicalRecordForm;