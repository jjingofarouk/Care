'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Typography, Grid, FormHelperText, IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { getMedicalRecord, createMedicalRecord, updateMedicalRecord } from '@/services/medicalRecordsService';

export default function MedicalRecordForm() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    patientId: '',
    recordDate: new Date(),
    chiefComplaint: { description: '', duration: '', onset: '' },
    presentIllness: { narrative: '', severity: '', progress: '', associatedSymptoms: '' },
    pastConditions: [],
    surgicalHistory: [],
    familyHistory: [],
    medicationHistory: [],
    socialHistory: { smokingStatus: '', alcoholUse: '', occupation: '', maritalStatus: '', livingSituation: '' },
    reviewOfSystems: [],
    immunizations: [],
    travelHistory: [],
    allergies: [],
    diagnoses: [],
    vitalSigns: [],
  });
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchMedicalRecord = async () => {
    if (!params.id) return;
    try {
      const data = await getMedicalRecord(params.id, true);
      setFormData({
        patientId: data.patientId || '',
        recordDate: new Date(data.recordDate),
        chiefComplaint: data.chiefComplaint || { description: '', duration: '', onset: '' },
        presentIllness: data.presentIllness || { narrative: '', severity: '', progress: '', associatedSymptoms: '' },
        pastConditions: data.pastConditions?.map((c) => ({
          ...c,
          diagnosisDate: c.diagnosisDate ? new Date(c.diagnosisDate) : null,
        })) || [],
        surgicalHistory: data.surgicalHistory?.map((s) => ({
          ...s,
          datePerformed: s.datePerformed ? new Date(s.datePerformed) : null,
        })) || [],
        familyHistory: data.familyHistory?.map((f) => ({
          ...f,
          ageAtDiagnosis: f.ageAtDiagnosis || '',
        })) || [],
        medicationHistory: data.medicationHistory?.map((m) => ({
          ...m,
          startDate: m.startDate ? new Date(m.startDate) : null,
          endDate: m.endDate ? new Date(m.endDate) : null,
        })) || [],
        socialHistory: data.socialHistory || { smokingStatus: '', alcoholUse: '', occupation: '', maritalStatus: '', livingSituation: '' },
        reviewOfSystems: data.reviewOfSystems || [],
        immunizations: data.immunizations?.map((i) => ({
          ...i,
          dateGiven: new Date(i.dateGiven),
        })) || [],
        travelHistory: data.travelHistory?.map((t) => ({
          ...t,
          dateFrom: t.dateFrom ? new Date(t.dateFrom) : null,
          dateTo: t.dateTo ? new Date(t.dateTo) : null,
        })) || [],
        allergies: data.allergies || [],
        diagnoses: data.diagnoses?.map((d) => ({
          ...d,
          diagnosedAt: new Date(d.diagnosedAt),
        })) || [],
        vitalSigns: data.vitalSigns?.map((v) => ({
          ...v,
          recordedAt: new Date(v.recordedAt),
          heartRate: v.heartRate || '',
          temperature: v.temperature || '',
          respiratoryRate: v.respiratoryRate || '',
          oxygenSaturation: v.oxygenSaturation || '',
        })) || [],
      });
    } catch (error) {
      console.error('Error fetching medical record:', error);
      setErrors({ submit: 'Failed to load medical record' });
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchMedicalRecord();
  }, [params.id]);

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleAddItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === 'immunizations'
          ? { vaccine: '', dateGiven: new Date(), administeredBy: '', notes: '' }
          : section === 'diagnoses'
          ? { code: '', description: '', diagnosedAt: new Date() }
          : section === 'vitalSigns'
          ? { bloodPressure: '', heartRate: '', temperature: '', respiratoryRate: '', oxygenSaturation: '', recordedAt: new Date() }
          : section === 'pastConditions'
          ? { condition: '', diagnosisDate: null, notes: '' }
          : section === 'surgicalHistory'
          ? { procedure: '', datePerformed: null, outcome: '', notes: '' }
          : section === 'familyHistory'
          ? { relative: '', condition: '', ageAtDiagnosis: '', notes: '' }
          : section === 'medicationHistory'
          ? { medicationName: '', dosage: '', frequency: '', startDate: null, endDate: null, isCurrent: false }
          : section === 'reviewOfSystems'
          ? { system: '', findings: '' }
          : section === 'travelHistory'
          ? { countryVisited: '', dateFrom: null, dateTo: null, purpose: '', travelNotes: '' }
          : section === 'allergies'
          ? { name: '', severity: '' }
          : {},
      ],
    }));
  };

  const handleRemoveItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.recordDate) newErrors.recordDate = 'Record date is required';
    if (formData.chiefComplaint.description && !formData.chiefComplaint.duration)
      newErrors.chiefComplaint = 'Chief complaint duration is required if description is provided';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSend = {
        ...formData,
        recordDate: format(formData.recordDate, 'yyyy-MM-dd'),
        pastConditions: formData.pastConditions.map((c) => ({
          ...c,
          diagnosisDate: c.diagnosisDate ? format(c.diagnosisDate, 'yyyy-MM-dd') : null,
        })),
        surgicalHistory: formData.surgicalHistory.map((s) => ({
          ...s,
          datePerformed: s.datePerformed ? format(s.datePerformed, 'yyyy-MM-dd') : null,
        })),
        familyHistory: formData.familyHistory.map((f) => ({
          ...f,
          ageAtDiagnosis: f.ageAtDiagnosis ? parseInt(f.ageAtDiagnosis, 10) : null,
        })),
        medicationHistory: formData.medicationHistory.map((m) => ({
          ...m,
          startDate: m.startDate ? format(m.startDate, 'yyyy-MM-dd') : null,
          endDate: m.endDate ? format(m.endDate, 'yyyy-MM-dd') : null,
        })),
        immunizations: formData.immunizations.map((i) => ({
          ...i,
          dateGiven: format(i.dateGiven, 'yyyy-MM-dd'),
        })),
        travelHistory: formData.travelHistory.map((t) => ({
          ...t,
          dateFrom: t.dateFrom ? format(t.dateFrom, 'yyyy-MM-dd') : null,
          dateTo: t.dateTo ? format(t.dateTo, 'yyyy-MM-dd') : null,
        })),
        diagnoses: formData.diagnoses.map((d) => ({
          ...d,
          diagnosedAt: format(d.diagnosedAt, 'yyyy-MM-dd'),
        })),
        vitalSigns: formData.vitalSigns.map((v) => ({
          ...v,
          recordedAt: format(v.recordedAt, 'yyyy-MM-dd'),
          heartRate: v.heartRate ? parseInt(v.heartRate, 10) : null,
          temperature: v.temperature ? parseFloat(v.temperature) : null,
          respiratoryRate: v.respiratoryRate ? parseInt(v.respiratoryRate, 10) : null,
          oxygenSaturation: v.oxygenSaturation ? parseFloat(v.oxygenSaturation) : null,
        })),
      };

      if (params.id) {
        await updateMedicalRecord(params.id, dataToSend);
      } else {
        await createMedicalRecord(dataToSend);
      }
      router.push('/medical-records');
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred while saving the record' });
      console.error('Error submitting form:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} className="w-full min-h-screen">
        <div className="card m-0 p-4">
          <Typography variant="h5" className="card-title mb-2">
            Medical Record Form
          </Typography>
          {errors.submit && (
            <div className="alert alert-error mb-2">{errors.submit}</div>
          )}
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.patientId} className="select">
                <InputLabel>Patient</InputLabel>
                <Select
                  value={formData.patientId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
                  label="Patient"
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.patientId && (
                  <FormHelperText className="text-[var(--hospital-error)]">
                    {errors.patientId}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Record Date"
                value={formData.recordDate}
                onChange={(date) => setFormData((prev) => ({ ...prev, recordDate: date }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.recordDate}
                    helperText={errors.recordDate}
                    className="input"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Chief Complaint
              </Typography>
              {errors.chiefComplaint && (
                <span className="text-sm text-[var(--hospital-error)]">
                  {errors.chiefComplaint}
                </span>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Description"
                value={formData.chiefComplaint.description}
                onChange={(e) => handleInputChange('chiefComplaint', 'description', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.chiefComplaint.duration}
                onChange={(e) => handleInputChange('chiefComplaint', 'duration', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Onset"
                value={formData.chiefComplaint.onset}
                onChange={(e) => handleInputChange('chiefComplaint', 'onset', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Present Illness
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Narrative"
                value={formData.presentIllness.narrative}
                onChange={(e) => handleInputChange('presentIllness', 'narrative', e.target.value)}
                className="textarea"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Severity"
                value={formData.presentIllness.severity}
                onChange={(e) => handleInputChange('presentIllness', 'severity', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Progress"
                value={formData.presentIllness.progress}
                onChange={(e) => handleInputChange('presentIllness', 'progress', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Associated Symptoms"
                value={formData.presentIllness.associatedSymptoms}
                onChange={(e) => handleInputChange('presentIllness', 'associatedSymptoms', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Past Medical Conditions
              </Typography>
              {formData.pastConditions.map((condition, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Condition"
                      value={condition.condition}
                      onChange={(e) => handleInputChange('pastConditions', 'condition', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="Diagnosis Date"
                      value={condition.diagnosisDate}
                      onChange={(date) => handleInputChange('pastConditions', 'diagnosisDate', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Notes"
                      value={condition.notes}
                      onChange={(e) => handleInputChange('pastConditions', 'notes', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <button
                      onClick={() => handleRemoveItem('pastConditions', index)}
                      disabled={formData.pastConditions.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('pastConditions')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Past Condition
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Surgical History
              </Typography>
              {formData.surgicalHistory.map((surgery, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Procedure"
                      value={surgery.procedure}
                      onChange={(e) => handleInputChange('surgicalHistory', 'procedure', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="Date Performed"
                      value={surgery.datePerformed}
                      onChange={(date) => handleInputChange('surgicalHistory', 'datePerformed', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Outcome"
                      value={surgery.outcome}
                      onChange={(e) => handleInputChange('surgicalHistory', 'outcome', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <button
                      onClick={() => handleRemoveItem('surgicalHistory', index)}
                      disabled={formData.surgicalHistory.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('surgicalHistory')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Surgical History
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Family History
              </Typography>
              {formData.familyHistory.map((family, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Relative"
                      value={family.relative}
                      onChange={(e) => handleInputChange('familyHistory', 'relative', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Condition"
                      value={family.condition}
                      onChange={(e) => handleInputChange('familyHistory', 'condition', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Age at Diagnosis"
                      type="number"
                      value={family.ageAtDiagnosis}
                      onChange={(e) => handleInputChange('familyHistory', 'ageAtDiagnosis', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <button
                      onClick={() => handleRemoveItem('familyHistory', index)}
                      disabled={formData.familyHistory.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('familyHistory')}
                className="btn btn-primaryške
                mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Family History
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Medication History
              </Typography>
              {formData.medicationHistory.map((medication, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Medication Name"
                      value={medication.medicationName}
                      onChange={(e) => handleInputChange('medicationHistory', 'medicationName', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Dosage"
                      value={medication.dosage}
                      onChange={(e) => handleInputChange('medicationHistory', 'dosage', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Frequency"
                      value={medication.frequency}
                      onChange={(e) => handleInputChange('medicationHistory', 'frequency', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="Start Date"
                      value={medication.startDate}
                      onChange={(date) => handleInputChange('medicationHistory', 'startDate', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="End Date"
                      value={medication.endDate}
                      onChange={(date) => handleInputChange('medicationHistory', 'endDate', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <button
                      onClick={() => handleRemoveItem('medicationHistory', index)}
                      disabled={formData.medicationHistory.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('medicationHistory')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Medication
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Social History
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Smoking Status"
                value={formData.socialHistory.smokingStatus}
                onChange={(e) => handleInputChange('socialHistory', 'smokingStatus', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Alcohol Use"
                value={formData.socialHistory.alcoholUse}
                onChange={(e) => handleInputChange('socialHistory', 'alcoholUse', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Occupation"
                value={formData.socialHistory.occupation}
                onChange={(e) => handleInputChange('socialHistory', 'occupation', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marital Status"
                value={formData.socialHistory.maritalStatus}
                onChange={(e) => handleInputChange('socialHistory', 'maritalStatus', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Living Situation"
                value={formData.socialHistory.livingSituation}
                onChange={(e) => handleInputChange('socialHistory', 'livingSituation', e.target.value)}
                className="input"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Review of Systems
              </Typography>
              {formData.reviewOfSystems.map((review, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="System"
                      value={review.system}
                      onChange={(e) => handleInputChange('reviewOfSystems', 'system', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Findings"
                      value={review.findings}
                      onChange={(e) => handleInputChange('reviewOfSystems', 'findings', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <button
                      onClick={() => handleRemoveItem('reviewOfSystems', index)}
                      disabled={formData.reviewOfSystems.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('reviewOfSystems')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Review of System
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Immunizations
              </Typography>
              {formData.immunizations.map((immunization, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Vaccine"
                      value={immunization.vaccine}
                      onChange={(e) => handleInputChange('immunizations', 'vaccine', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="Date Given"
                      value={immunization.dateGiven}
                      onChange={(date) => handleInputChange('immunizations', 'dateGiven', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Administered By"
                      value={immunization.administeredBy}
                      onChange={(e) => handleInputChange('immunizations', 'administeredBy', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <button
                      onClick={() => handleRemoveItem('immunizations', index)}
                      disabled={formData.immunizations.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('immunizations')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Immunization
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Travel History
              </Typography>
              {formData.travelHistory.map((travel, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Country Visited"
                      value={travel.countryVisited}
                      onChange={(e) => handleInputChange('travelHistory', 'countryVisited', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="Date From"
                      value={travel.dateFrom}
                      onChange={(date) => handleInputChange('travelHistory', 'dateFrom', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="Date To"
                      value={travel.dateTo}
                      onChange={(date) => handleInputChange('travelHistory', 'dateTo', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Purpose"
                      value={travel.purpose}
                      onChange={(e) => handleInputChange('travelHistory', 'purpose', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <button
                      onClick={() => handleRemoveItem('travelHistory', index)}
                      disabled={formData.travelHistory.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('travelHistory')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Travel History
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Allergies
              </Typography>
              {formData.allergies.map((allergy, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Allergy Name"
                      value={allergy.name}
                      onChange={(e) => handleInputChange('allergies', 'name', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Severity"
                      value={allergy.severity}
                      onChange={(e) => handleInputChange('allergies', 'severity', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <button
                      onClick={() => handleRemoveItem('allergies', index)}
                      disabled={formData.allergies.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('allergies')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Allergy
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Diagnoses
              </Typography>
              {formData.diagnoses.map((diagnosis, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Code"
                      value={diagnosis.code}
                      onChange={(e) => handleInputChange('diagnoses', 'code', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={diagnosis.description}
                      onChange={(e) => handleInputChange('diagnoses', 'description', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="Diagnosed At"
                      value={diagnosis.diagnosedAt}
                      onChange={(date) => handleInputChange('diagnoses', 'diagnosedAt', date, index)}
                      renderInput={(params) => <TextField {...params} fullWidth className="input" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <button
                      onClick={() => handleRemoveItem('diagnoses', index)}
                      disabled={formData.diagnoses.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('diagnoses')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Diagnosis
              </button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="card-title mt-2">
                Vital Signs
              </Typography>
              {formData.vitalSigns.map((vital, index) => (
                <Grid container spacing={1} key={index} className="mb-2">
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Blood Pressure"
                      value={vital.bloodPressure}
                      onChange={(e) => handleInputChange('vitalSigns', 'bloodPressure', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Heart Rate"
                      type="number"
                      value={vital.heartRate}
                      onChange={(e) => handleInputChange('vitalSigns', 'heartRate', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Temperature"
                      type="number"
                      value={vital.temperature}
                      onChange={(e) => handleInputChange('vitalSigns', 'temperature', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Respiratory Rate"
                      type="number"
                      value={vital.respiratoryRate}
                      onChange={(e) => handleInputChange('vitalSigns', 'respiratoryRate', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Oxygen Saturation"
                      type="number"
                      value={vital.oxygenSaturation}
                      onChange={(e) => handleInputChange('vitalSigns', 'oxygenSaturation', e.target.value, index)}
                      className="input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <button
                      onClick={() => handleRemoveItem('vitalSigns', index)}
                      disabled={formData.vitalSigns.length === 0}
                      className="btn btn-danger p-2 min-h-0 h-8 w-8"
                    >
                      <Delete className="!w-4 !h-4" />
                    </button>
                  </Grid>
                </Grid>
              ))}
              <button
                onClick={() => handleAddItem('vitalSigns')}
                className="btn btn-primary mt-1"
              >
                <Add className="!w-4 !h-4 mr-1" /> Add Vital Sign
              </button>
            </Grid>
            <Grid item xs={12}>
              <button
                type="submit"
                className="btn btn-primary mt-2"
              >
                {params.id ? 'Update' : 'Create'} Medical Record
              </button>
            </Grid>
          </Grid>
        </div>
      </Box>
    </LocalizationProvider>
  );
}