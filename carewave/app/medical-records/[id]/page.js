'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import medicalRecordsService from '@/services/medicalRecordsService';
import MedicalRecordForm from '@/components/medical-records/MedicalRecordForm';

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await medicalRecordsService.getMedicalRecordById(id);
        setRecord(data);
      } catch (err) {
        setError('Failed to load medical record');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = async () => {
    try {
      await medicalRecordsService.deleteMedicalRecord(id);
      router.push('/medical-records');
    } catch (err) {
      setError('Failed to delete medical record');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      await medicalRecordsService.updateMedicalRecord(id, data);
      setEditing(false);
      const updatedRecord = await medicalRecordsService.getMedicalRecordById(id);
      setRecord(updatedRecord);
    } catch (err) {
      setError('Failed to update medical record');
    }
  };

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box color="error.main">{error}</Box>;
  if (!record) return <Box>Record not found</Box>;

  if (editing) {
    return (
      <Box className="container mx-auto p-4">
        <MedicalRecordForm initialData={record} medicalRecord={record} onSubmit={handleFormSubmit} />
        <Button variant="outlined" onClick={() => setEditing(false)} className="mt-4">Cancel Edit</Button>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto p-4">
      <Typography variant="h4" className="mb-4">Medical Record Details</Typography>
      <Paper className="p-4">
        <Typography variant="h6">Patient: {record.patient?.name}</Typography>
        <Typography variant="h6">Doctor: {record.doctor?.name} ({record.doctor?.department?.name || 'N/A'})</Typography>
        <Typography variant="h6">Record Date: {new Date(record.recordDate).toLocaleDateString()}</Typography>
        
        {record.chiefComplaint && (
          <Box mt={2}>
            <Typography variant="subtitle1">Chief Complaint</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Description" secondary={record.chiefComplaint.description} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Duration" secondary={record.chiefComplaint.duration} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Onset" secondary={record.chiefComplaint.onset || 'N/A'} />
              </ListItem>
            </List>
          </Box>
        )}

        {record.presentIllness && (
          <Box mt={2}>
            <Typography variant="subtitle1">Present Illness</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Narrative" secondary={record.presentIllness.narrative} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Severity" secondary={record.presentIllness.severity || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Progress" secondary={record.presentIllness.progress || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Associated Symptoms" secondary={record.presentIllness.associatedSymptoms || 'N/A'} />
              </ListItem>
            </List>
          </Box>
        )}

        {record.diagnoses?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Diagnoses</Typography>
            <List>
              {record.diagnoses.map(d => (
                <ListItem key={d.id}>
                  <ListItemText
                    primary={`${d.code}: ${d.description}`}
                    secondary={`Diagnosed: ${new Date(d.diagnosedAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.vitalSigns?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Vital Signs</Typography>
            <List>
              {record.vitalSigns.map(v => (
                <ListItem key={v.id}>
                  <ListItemText
                    primary={`BP: ${v.bloodPressure || 'N/A'}, HR: ${v.heartRate || 'N/A'}, Temp: ${v.temperature || 'N/A'}`}
                    secondary={`Recorded: ${new Date(v.recordedAt).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.allergies?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Allergies</Typography>
            <List>
              {record.allergies.map(a => (
                <ListItem key={a.id}>
                  <ListItemText primary={a.name} secondary={`Severity: ${a.severity}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.pastConditions?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Past Conditions</Typography>
            <List>
              {record.pastConditions.map(p => (
                <ListItem key={p.id}>
                  <ListItemText
                    primary={p.condition}
                    secondary={`Diagnosed: ${p.diagnosisDate ? new Date(p.diagnosisDate).toLocaleDateString() : 'N/A'}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.surgicalHistory?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Surgical History</Typography>
            <List>
              {record.surgicalHistory.map(s => (
                <ListItem key={s.id}>
                  <ListItemText
                    primary={s.procedure}
                    secondary={`Performed: ${s.datePerformed ? new Date(s.datePerformed).toLocaleDateString() : 'N/A'}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.familyHistory?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Family History</Typography>
            <List>
              {record.familyHistory.map(f => (
                <ListItem key={f.id}>
                  <ListItemText
                    primary={`${f.relative}: ${f.condition}`}
                    secondary={`Age at Diagnosis: ${f.ageAtDiagnosis || 'N/A'}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.medicationHistory?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Medication History</Typography>
            <List>
              {record.medicationHistory.map(m => (
                <ListItem key={m.id}>
                  <ListItemText
                    primary={`${m.medicationName} (${m.dosage})`}
                    secondary={`Current: ${m.isCurrent ? 'Yes' : 'No'}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.socialHistory && (
          <Box mt={2}>
            <Typography variant="subtitle1">Social History</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Smoking Status" secondary={record.socialHistory.smokingStatus || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Alcohol Use" secondary={record.socialHistory.alcoholUse || 'N/A'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Occupation" secondary={record.socialHistory.occupation || 'N/A'} />
              </ListItem>
            </List>
          </Box>
        )}

        {record.reviewOfSystems?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Review of Systems</Typography>
            <List>
              {record.reviewOfSystems.map(r => (
                <ListItem key={r.id}>
                  <ListItemText primary={r.system} secondary={r.findings} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.immunizations?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Immunizations</Typography>
            <List>
              {record.immunizations.map(i => (
                <ListItem key={i.id}>
                  <ListItemText
                    primary={i.vaccine}
                    secondary={`Given: ${new Date(i.dateGiven).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {record.travelHistory?.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">Travel History</Typography>
            <List>
              {record.travelHistory.map(t => (
                <ListItem key={t.id}>
                  <ListItemText
                    primary={t.countryVisited}
                    secondary={`From: ${t.dateFrom ? new Date(t.dateFrom).toLocaleDateString() : 'N/A'}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
      <Box className="mt-4 flex gap-2">
        <Button variant="contained" onClick={handleEdit}>Edit</Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
        <Button variant="outlined" onClick={() => router.push('/medical-records')}>Back</Button>
      </Box>
    </Box>
  );
}