'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Divider, Typography } from '@mui/material';
import { X, Save, User } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const MedicalRecordForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [resourceType, setResourceType] = useState('medicalRecord');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch patients for the dropdown (assuming a patient service exists)
    const fetchPatients = async () => {
      try {
        const response = await medicalRecordsService.getAllMedicalRecords({ resource: 'patients' });
        setPatients(response);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ resource: resourceType, ...formData });
  };

  const resourceFields = {
    medicalRecord: (
      <>
        <FormControl fullWidth className="mb-4">
          <InputLabel>Patient</InputLabel>
          <Select
            name="patientId"
            value={formData.patientId || ''}
            onChange={handleChange}
            className="input"
          >
            {patients.map(patient => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </Select>
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
        />
      </>
    ),
    allergy: (
      <>
        <TextField
          label="Medical Record ID"
          name="medicalRecordId"
          value={formData.medicalRecordId || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
        />
        <TextField
          label="Allergy Name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
        />
        <FormControl fullWidth className="mb-4">
          <InputLabel>Severity</InputLabel>
          <Select
            name="severity"
            value={formData.severity || ''}
            onChange={handleChange}
            className="input"
          >
            <MenuItem value="mild">Mild</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="severe">Severe</MenuItem>
          </Select>
        </FormControl>
      </>
    ),
    diagnosis: (
      <>
        <TextField
          label="Medical Record ID"
          name="medicalRecordId"
          value={formData.medicalRecordId || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
        />
        <TextField
          label="Code"
          name="code"
          value={formData.code || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
        />
        <TextField
          label="Diagnosed At"
          name="diagnosedAt"
          type="date"
          value={formData.diagnosedAt || ''}
          onChange={handleChange}
          fullWidth
          className="input mb-4"
          InputLabelProps={{ shrink: true }}
        />
      </>
    ),
    // Add similar field structures for other resource types
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <FormControl fullWidth className="mb-4">
        <InputLabel>Record Type</InputLabel>
        <Select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="input"
        >
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
        <Button
          type="submit"
          variant="contained"
          className="btn-primary flex-1"
          startIcon={<Save />}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          className="btn-outline"
          onClick={() => setFormData({})}
          startIcon={<X />}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default MedicalRecordForm;