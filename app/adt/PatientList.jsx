"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import { getPatients, updatePatient, deletePatient } from './adtService';

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
          sx={{
            fontSize: { xs: '0.675rem', sm: '0.75rem' },
            padding: { xs: '3px 6px', sm: '4px 8px' },
            textTransform: 'none',
            borderRadius: '4px',
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: { xs: '4px', sm: '8px' },
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600,
          color: '#333',
          margin: 0,
          padding: '8px 0',
          textAlign: 'left',
        }}
      >
        Patients List
      </Typography>
      {error && (
        <Alert
          severity="error"
          sx={{
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            padding: '8px',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            borderRadius: '4px',
          }}
        >
          Failed to load patients: {error}
        </Alert>
      )}
      {patients.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            padding: '8px',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            borderRadius: '4px',
          }}
        >
          No patients found.
        </Alert>
      )}
      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          overflowX: 'auto',
        }}
      >
        <DataGrid
          rows={patients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          onCellEditStop={handleCellEditCommit}
          sx={{
            width: '100%',
            border: 'none',
            backgroundColor: '#fff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            '& .MuiDataGrid-cell': {
              padding: '4px 8px',
            },
            '& .MuiDataGrid-columnHeader': {
              padding: '4px 8px',
              backgroundColor: '#f9f9f9',
              color: '#333',
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: '4px',
            },
            '& .MuiDataGrid-footerContainer': {
              padding: '4px',
            },
          }}
        />
      </Box>
    </Box>
  );
}