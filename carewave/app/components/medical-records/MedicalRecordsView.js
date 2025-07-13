'use client';
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import medicalRecordsService from '@/services/medicalRecordsService';
import { User } from 'lucide-react';

export default function MedicalRecordsView({ patientName, setPatientName }) {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await medicalRecordsService.getPatients();
        setPatients(patientData);
      } catch (err) {
        setError('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      if (selectedPatient) {
        setLoading(true);
        try {
          const recordData = await medicalRecordsService.getAllMedicalRecords({ patientId: selectedPatient.id });
          setRecords(recordData);
        } catch (err) {
          setError('Failed to load medical records');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecords();
  }, [selectedPatient]);

  useEffect(() => {
    const matchedPatient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
    setSelectedPatient(matchedPatient || null);
  }, [patientName, patients]);

  const handleViewDetails = (recordId) => {
    router.push(`/medical-records/${recordId}`);
  };

  const getSummary = (record) => {
    if (record.chiefComplaint) return record.chiefComplaint.description;
    if (record.diagnoses?.length) return record.diagnoses[0].description;
    if (record.vitalSigns?.length) return `Vital Signs Recorded: ${record.vitalSigns[0].recordedAt}`;
    return 'No summary available';
  };

  if (error && !patients.length) {
    return (
      <Box className="card max-w-full mx-auto p-4">
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box className="mb-4">
      <Autocomplete
        options={patients}
        getOptionLabel={(option) => option.name || ''}
        onChange={(e, value) => {
          setSelectedPatient(value);
          setPatientName(value ? value.name : '');
        }}
        value={selectedPatient}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Patient"
            className="input"
            InputProps={{
              ...params.InputProps,
              startAdornment: <User className="h-4 w-4 mr-2" />,
            }}
            onChange={(e) => setPatientName(e.target.value)}
          />
        )}
      />
      {selectedPatient && (
        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Record Date</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No records found</TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.recordDate).toLocaleDateString()}</TableCell>
                    <TableCell>{record.doctor?.name || 'N/A'}</TableCell>
                    <TableCell>{getSummary(record)}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleViewDetails(record.id)}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}