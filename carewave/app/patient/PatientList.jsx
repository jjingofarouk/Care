"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PatientForm from './PatientForm';
import MedicalRecordsList from './MedicalRecordsList';
import { getPatients, updatePatient, deletePatient } from './patientService';

export default function PatientList({ patients, onSuccess, onEdit }) {
  const [localPatients, setLocalPatients] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [openMedicalRecordsModal, setOpenMedicalRecordsModal] = useState(false);
  const [medicalRecordsPatient, setMedicalRecordsPatient] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        setLocalPatients(
          data.map((patient) => ({
            id: patient.id,
            patientId: patient.patientId || 'N/A',
            name: patient.name || 'No Name',
            email: patient.email || 'No Email',
            phone: patient.phone || 'N/A',
            gender: patient.gender || 'N/A',
            dateOfBirth: patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString()
              : 'N/A',
            bloodType: patient.bloodType || 'N/A',
            address: patient.address || 'N/A',
            emergencyContact: patient.emergencyContact || 'N/A',
            emergencyContactPhone: patient.emergencyContactPhone || 'N/A',
            insuranceProvider: patient.insuranceProvider || 'N/A',
            insurancePolicy: patient.insurancePolicy || 'N/A',
            allergies: patient.allergies || 'N/A',
            medicalHistory: patient.medicalHistory || 'N/A',
            presentingComplaint: patient.presentingComplaint || 'N/A',
            familyHistory: patient.familyHistory || 'N/A',
            socialHistory: patient.socialHistory || 'N/A',
            pastMedicalHistory: patient.pastMedicalHistory || 'N/A',
            medications: patient.medications || 'N/A',
          }))
        );
        setError(null);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    if (!patients || patients.length === 0) {
      fetchPatients();
    } else {
      setLocalPatients(
        patients.map((patient) => ({
          id: patient.id,
          patientId: patient.patientId || 'N/A',
          name: patient.name || 'No Name',
          email: patient.email || 'No Email',
          phone: patient.phone || 'N/A',
          gender: patient.gender || 'N/A',
          dateOfBirth: patient.dateOfBirth
            ? new Date(patient.dateOfBirth).toLocaleDateString()
            : 'N/A',
          bloodType: patient.bloodType || 'N/A',
          address: patient.address || 'N/A',
          emergencyContact: patient.emergencyContact || 'N/A',
          emergencyContactPhone: patient.emergencyContactPhone || 'N/A',
          insuranceProvider: patient.insuranceProvider || 'N/A',
          insurancePolicy: patient.insurancePolicy || 'N/A',
          allergies: patient.allergies || 'N/A',
          medicalHistory: patient.medicalHistory || 'N/A',
          presentingComplaint: patient.presentingComplaint || 'N/A',
          familyHistory: patient.familyHistory || 'N/A',
          socialHistory: patient.socialHistory || 'N/A',
          pastMedicalHistory: patient.pastMedicalHistory || 'N/A',
          medications: patient.medications || 'N/A',
        }))
      );
    }
  }, [patients]);

  const handleEdit = (patient) => {
    if (onEdit) onEdit(patient);
    setSelectedPatient(patient);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedPatient(null);
  };

  const handleSuccess = () => {
    setOpenEditModal(false);
    setSelectedPatient(null);
    if (onSuccess) onSuccess();
    async function refreshPatients() {
      try {
        const data = await getPatients();
        setLocalPatients(
          data.map((patient) => ({
            id: patient.id,
            patientId: patient.patientId || 'N/A',
            name: patient.name || 'No Name',
            email: patient.email || 'No Email',
            phone: patient.phone || 'N/A',
            gender: patient.gender || 'N/A',
            dateOfBirth: patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString()
              : 'N/A',
            bloodType: patient.bloodType || 'N/A',
            address: patient.address || 'N/A',
            emergencyContact: patient.emergencyContact || 'N/A',
            emergencyContactPhone: patient.emergencyContactPhone || 'N/A',
            insuranceProvider: patient.insuranceProvider || 'N/A',
            insurancePolicy: patient.insurancePolicy || 'N/A',
            allergies: patient.allergies || 'N/A',
            medicalHistory: patient.medicalHistory || 'N/A',
            presentingComplaint: patient.presentingComplaint || 'N/A',
            familyHistory: patient.familyHistory || 'N/A',
            socialHistory: patient.socialHistory || 'N/A',
            pastMedicalHistory: patient.pastMedicalHistory || 'N/A',
            medications: patient.medications || 'N/A',
          }))
        );
      } catch (error) {
        console.error('Error refreshing patients:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    refreshPatients();
  };

  const handleDeleteConfirm = (id) => {
    setPatientToDelete(id);
    setOpenDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await deletePatient(patientToDelete);
      setLocalPatients(localPatients.filter((row) => row.id !== patientToDelete));
      setOpenDeleteConfirm(false);
      setPatientToDelete(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleViewMedicalRecords = (patient) => {
    setMedicalRecordsPatient(patient);
    setOpenMedicalRecordsModal(true);
  };

  const handleCloseMedicalRecordsModal = () => {
    setOpenMedicalRecordsModal(false);
    setMedicalRecordsPatient(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientId', headerName: 'Patient ID', width: 120 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
    { field: 'bloodType', headerName: 'Blood Type', width: 120 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'emergencyContact', headerName: 'Emergency Contact', width: 150 },
    { field: 'emergencyContactPhone', headerName: 'Emergency Contact Phone', width: 180 },
    { field: 'insuranceProvider', headerName: 'Insurance Provider', width: 150 },
    { field: 'insurancePolicy', headerName: 'Insurance Policy', width: 150 },
    { field: 'allergies', headerName: 'Allergies', width: 200 },
    { field: 'medicalHistory', headerName: 'Medical History', width: 250 },
    { field: 'presentingComplaint', headerName: 'Presenting Complaint', width: 200 },
    { field: 'familyHistory', headerName: 'Family History', width: 200 },
    { field: 'socialHistory', headerName: 'Social History', width: 200 },
    { field: 'pastMedicalHistory', headerName: 'Past Medical History', width: 200 },
    { field: 'medications', headerName: 'Medications', width: 200 },
    {
      field: 'medicalRecords',
      headerName: 'Medical Records',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleViewMedicalRecords(params.row)}
          sx={{
            fontSize: { xs: '0.675rem', sm: '0.75rem' },
            padding: { xs: '3px 6px', sm: '4px 8px' },
            textTransform: 'none',
            borderRadius: '4px',
          }}
        >
          Open
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{
              fontSize: { xs: '0.675rem', sm: '0.75rem' },
              padding: { xs: '3px 6px', sm: '4px 8px' },
              textTransform: 'none',
              borderRadius: '4px',
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteConfirm(params.row.id)}
            sx={{
              fontSize: { xs: '0.675rem', sm: '0.75rem' },
              padding: { xs: '3px 6px', sm: '4px 8px' },
              textTransform: 'none',
              borderRadius: '4px',
            }}
          >
            Delete
          </Button>
        </Box>
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
      {localPatients.length === 0 && !error && (
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
          rows={localPatients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
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
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          <PatientForm patient={selectedPatient} onSubmit={handleSuccess} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this patient?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMedicalRecordsModal} onClose={handleCloseMedicalRecordsModal} maxWidth="lg" fullWidth>
        <DialogTitle>Medical Records for {medicalRecordsPatient?.name}</DialogTitle>
        <DialogContent>
          <MedicalRecordsList
            medicalRecords={medicalRecordsPatient?.medicalRecords || []}
            patients={[medicalRecordsPatient]}
            onSuccess={handleSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMedicalRecordsModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}