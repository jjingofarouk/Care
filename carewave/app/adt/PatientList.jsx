"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import { getPatients, updatePatient, deletePatient } from './adtService';
import styles from './PatientList.module.css'; // Ensure this path is correct

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        setPatients(
          data.map((patient) => ({
            id: patient.id,
            patientId: patient.patientId || '',
            name: patient.user?.name || '',
            email: patient.user?.email || '',
            phone: patient.phone || '',
            gender: patient.gender || '',
            dateOfBirth: patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString()
              : '',
            bloodType: patient.bloodType || '',
          }))
        );
        setError(null);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchPatients();
  }, []);

  const handleCellEditCommit = async (params, event, details) => {
    if (details.reason === GridCellEditStopReasons.cellEditEnd) {
      try {
        const updatedData = {
          patientId: params.row.patientId || '',
          name: params.row.name || '',
          email: params.row.email || '',
          phone: params.row.phone || null,
          gender: params.row.gender || null,
          dateOfBirth: params.row.dateOfBirth
            ? new Date(params.row.dateOfBirth)
            : null,
          bloodType: params.row.bloodType || null,
          [params.field]: params.value,
        };
        await updatePatient(params.id, updatedData);
        setPatients(
          patients.map((row) =>
            row.id === params.id ? { ...row, [params.field]: params.value } : row
          )
        );
      } catch (error) {
        console.error('Error updating patient:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientId', headerName: 'Patient ID', width: 120 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 180, editable: true },
    { field: 'phone', headerName: 'Phone', width: 150, editable: true },
    { field: 'gender', headerName: 'Gender', width: 100, editable: true },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
    { field: 'bloodType', headerName: 'Blood Type', width: 120, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row.id)}
          className={styles.button} // Correct usage of styles
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Patients List
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load patients: {error}
        </Alert>
      )}
      {patients.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No patients found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={patients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className={styles.dataGrid}
          onCellEditStop={handleCellEditCommit}
        />
      </Box>
    </Box>
  );
}