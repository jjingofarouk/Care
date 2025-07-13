'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, Grid, Button, Divider, Alert } from '@mui/material';
import { format } from 'date-fns';
import { getMedicalRecord } from '../../services/medicalRecordsService';

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicalRecord() {
      try {
        setLoading(true);
        const data = await getMedicalRecord(params.id, true);
        setRecord(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching medical record:', error);
        setError(error.message || 'Failed to load medical record');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchMedicalRecord();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading medical record...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => router.push('/medical-records')} sx={{ mt: 2 }}>
          Back to Records
        </Button>
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">Medical record not found</Alert>
        <Button variant="contained" onClick={() => router.push('/medical-records')} sx={{ mt: 2 }}>
          Back to Records
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Medical Record for {record.patient?.firstName || 'N/A'} {record.patient?.lastName || 'N/A'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => router.push(`/medical-records/${params.id}/edit`)}>
              Edit Record
            </Button>
            <Button variant="outlined" onClick={() => router.push('/medical-records')}>
              Back to Records
            </Button>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Record Details</Typography>
            <Typography>Record ID: {record.id || 'N/A'}</Typography>
            <Typography>Record Date: {record.recordDate ? format(new Date(record.recordDate), 'MM/dd/yyyy') : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* Chief Complaint */}
          {record.chiefComplaint && (
            <Grid item xs={12}>
              <Typography variant="h6">Chief Complaint</Typography>
              <Typography>Description: {record.chiefComplaint.description || 'N/A'}</Typography>
              <Typography>Duration: {record.chiefComplaint.duration || 'N/A'}</Typography>
              <Typography>Onset: {record.chiefComplaint.onset || 'N/A'}</Typography>
            </Grid>
          )}
          {/* Present Illness */}
          {record.presentIllness && (
            <Grid item xs={12}>
              <Typography variant="h6">Present Illness</Typography>
              <Typography>Narrative: {record.presentIllness.narrative || 'N/A'}</Typography>
              <Typography>Severity: {record.presentIllness.severity || 'N/A'}</Typography>
              <Typography>Progress: {record.presentIllness.progress || 'N/A'}</Typography>
              <Typography>Associated Symptoms: {record.presentIllness.associatedSymptoms || 'N/A'}</Typography>
            </Grid>
          )}
          {/* Past Conditions */}
          {record.pastConditions?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Past Medical Conditions</Typography>
              {record.pastConditions.map((condition, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Condition: {condition.condition || 'N/A'}</Typography>
                  <Typography>Diagnosis Date: {condition.diagnosisDate ? format(new Date(condition.diagnosisDate), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>Notes: {condition.notes || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Surgical History */}
          {record.surgicalHistory?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Surgical History</Typography>
              {record.surgicalHistory.map((surgery, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Procedure: {surgery.procedure || 'N/A'}</Typography>
                  <Typography>Date Performed: {surgery.datePerformed ? format(new Date(surgery.datePerformed), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>Outcome: {surgery.outcome || 'N/A'}</Typography>
                  <Typography>Notes: {surgery.notes || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Family History */}
          {record.familyHistory?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Family History</Typography>
              {record.familyHistory.map((family, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Relative: {family.relative || 'N/A'}</Typography>
                  <Typography>Condition: {family.condition || 'N/A'}</Typography>
                  <Typography>Age at Diagnosis: {family.ageAtDiagnosis || 'N/A'}</Typography>
                  <Typography>Notes: {family.notes || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Medication History */}
          {record.medicationHistory?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Medication History</Typography>
              {record.medicationHistory.map((medication, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Medication: {medication.medicationName || 'N/A'}</Typography>
                  <Typography>Dosage: {medication.dosage || 'N/A'}</Typography>
                  <Typography>Frequency: {medication.frequency || 'N/A'}</Typography>
                  <Typography>Start Date: {medication.startDate ? format(new Date(medication.startDate), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>End Date: {medication.endDate ? format(new Date(medication.endDate), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>Current: {medication.isCurrent ? 'Yes' : 'No'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Social History */}
          {record.socialHistory && (
            <Grid item xs={12}>
              <Typography variant="h6">Social History</Typography>
              <Typography>Smoking Status: {record.socialHistory.smokingStatus || 'N/A'}</Typography>
              <Typography>Alcohol Use: {record.socialHistory.alcoholUse || 'N/A'}</Typography>
              <Typography>Occupation: {record.socialHistory.occupation || 'N/A'}</Typography>
              <Typography>Marital Status: {record.socialHistory.maritalStatus || 'N/A'}</Typography>
              <Typography>Living Situation: {record.socialHistory.livingSituation || 'N/A'}</Typography>
            </Grid>
          )}
          {/* Review of Systems */}
          {record.reviewOfSystems?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Review of Systems</Typography>
              {record.reviewOfSystems.map((review, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>System: {review.system || 'N/A'}</Typography>
                  <Typography>Findings: {review.findings || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Immunizations */}
          {record.immunizations?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Immunizations</Typography>
              {record.immunizations.map((immunization, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Vaccine: {immunization.vaccine || 'N/A'}</Typography>
                  <Typography>Date Given: {immunization.dateGiven ? format(new Date(immunization.dateGiven), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>Administered By: {immunization.administeredBy || 'N/A'}</Typography>
                  <Typography>Notes: {immunization.notes || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Travel History */}
          {record.travelHistory?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Travel History</Typography>
              {record.travelHistory.map((travel, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Country Visited: {travel.countryVisited || 'N/A'}</Typography>
                  <Typography>Date From: {travel.dateFrom ? format(new Date(travel.dateFrom), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>Date To: {travel.dateTo ? format(new Date(travel.dateTo), 'MM/dd/yyyy') : 'N/A'}</Typography>
                  <Typography>Purpose: {travel.purpose || 'N/A'}</Typography>
                  <Typography>Notes: {travel.travelNotes || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Allergies */}
          {record.allergies?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Allergies</Typography>
              {record.allergies.map((allergy, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Name: {allergy.name || 'N/A'}</Typography>
                  <Typography>Severity: {allergy.severity || 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Diagnoses */}
          {record.diagnoses?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Diagnoses</Typography>
              {record.diagnoses.map((diagnosis, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Code: {diagnosis.code || 'N/A'}</Typography>
                  <Typography>Description: {diagnosis.description || 'N/A'}</Typography>
                  <Typography>Diagnosed At: {diagnosis.diagnosedAt ? format(new Date(diagnosis.diagnosedAt), 'MM/dd/yyyy') : 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          {/* Vital Signs */}
          {record.vitalSigns?.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Vital Signs</Typography>
              {record.vitalSigns.map((vital, index) => (
                <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                  <Typography>Blood Pressure: {vital.bloodPressure || 'N/A'}</Typography>
                  <Typography>Heart Rate: {vital.heartRate || 'N/A'}</Typography>
                  <Typography>Temperature: {vital.temperature || 'N/A'}</Typography>
                  <Typography>Respiratory Rate: {vital.respiratoryRate || 'N/A'}</Typography>
                  <Typography>Oxygen Saturation: {vital.oxygenSaturation || 'N/A'}</Typography>
                  <Typography>Recorded At: {vital.recordedAt ? format(new Date(vital.recordedAt), 'MM/dd/yyyy') : 'N/A'}</Typography>
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
}