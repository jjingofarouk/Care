"use client";
import React, { useState, useEffect } from 'react';
import { Box, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PatientForm from './PatientForm';
import MedicalRecordsList from './MedicalRecordsList';
import { getPatients, deletePatient } from './patientService';

export default function PatientList({ patients, onSuccess }) {
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
            medicalRecords: patient.medicalRecords || [],
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
          medicalRecords: patient.medicalRecords || [],
        }))
      );
    }
  }, [patients]);

  const handleEdit = (patient) => {
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
            medicalRecords: patient.medicalRecords || [],
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
          className="border-hospital-accent text-hospital-accent hover:bg-hospital-accent hover:text-hospital-white rounded-md px-4 py-2"
          onClick={() => handleViewMedicalRecords(params.row)}
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
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            className="border-hospital-teal-light text-hospital-teal-light hover:bg-hospital-teal-light hover:text-hospital-white rounded-md px-4 py-2"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            className="border-hospital-error text-hospital-error hover:bg-hospital-error hover:text-hospital-white rounded-md px-4 py-2"
            onClick={() => handleDeleteConfirm(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">
        Patients List
      </h2>
      {error && (
        <Alert severity="error" className="mb-4">
          Failed to load patients: {error}
        </Alert>
      )}
      {localPatients.length === 0 && !error && (
        <Alert severity="info" className="mb-4">
          No patients found.
        </Alert>
      )}
      <Box className="w-full overflow-x-auto">
        <DataGrid
          rows={localPatients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md shadow-md"
        />
      </Box>
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
        <DialogTitle className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white">Edit Patient</DialogTitle>
        <DialogContent className="bg-hospital-white dark:bg-hospital-gray-900">
          <PatientForm patient={selectedPatient} onSubmit={handleSuccess} />
        </DialogContent>
        <DialogActions className="bg-hospital-gray-50 dark:bg-hospital-gray-800">
          <Button
            onClick={handleCloseEditModal}
            className="border-hospital-gray-400 text-hospital-gray-400 hover:bg-hospital-gray-400 hover:text-hospital-white rounded-md px-4 py-2"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white">Confirm Delete</DialogTitle>
        <DialogContent className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white">
          <p>Are you sure you want to delete this patient?</p>
        </DialogContent>
        <DialogActions className="bg-hospital-gray-50 dark:bg-hospital-gray-800">
          <Button
            onClick={() => setOpenDeleteConfirm(false)}
            className="border-hospital-gray-400 text-hospital-gray-400 hover:bg-hospital-gray-400 hover:text-hospital-white rounded-md px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="border-hospital-error text-hospital-error hover:bg-hospital-error hover:text-hospital-white rounded-md px-4 py-2"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMedicalRecordsModal} onClose={handleCloseMedicalRecordsModal} maxWidth="lg" fullWidth>
        <DialogTitle className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white">Medical Records for {medicalRecordsPatient?.name}</DialogTitle>
        <DialogContent className="bg-hospital-white dark:bg-hospital-gray-900">
          <MedicalRecordsList
            medicalRecords={medicalRecordsPatient?.medicalRecords || []}
            patients={[medicalRecordsPatient]}
            onSuccess={handleSuccess}
          />
        </DialogContent>
        <DialogActions className="bg-hospital-gray-50 dark:bg-hospital-gray-800">
          <Button
            onClick={handleCloseMedicalRecordsModal}
            className="border-hospital-gray-400 text-hospital-gray-400 hover:bg-hospital-gray-400 hover:text-hospital-white rounded-md px-4 py-2"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}