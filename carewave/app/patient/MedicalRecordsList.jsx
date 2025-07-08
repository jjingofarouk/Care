"use client";
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
} from '@mui/material';
import { updateMedicalRecord, deleteMedicalRecord } from '../medical-records/medicalRecordsService';
import MedicalHistoryForm from '../medical-records/MedicalHistoryForm';

export default function MedicalRecordsList({ medicalRecords, patients, onSuccess }) {
  const [filteredRecords, setFilteredRecords] = useState(medicalRecords);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    patientId: '',
    recordId: '',
    diagnosis: '',
    presentingComplaint: '',
    familyHistory: '',
    socialHistory: '',
    pastMedicalHistory: '',
    allergies: '',
    medications: '',
    date: '',
    doctorName: '',
  });

  useEffect(() => {
    setFilteredRecords(medicalRecords);
  }, [medicalRecords]);

  const handleFilterChange = (e) => {
    const patientId = e.target.value;
    setSelectedPatient(patientId);
    if (patientId) {
      setFilteredRecords(medicalRecords.filter((record) => record.patientId === parseInt(patientId)));
    } else {
      setFilteredRecords(medicalRecords);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
    setFilteredRecords((prev) =>
      [...prev].sort((a, b) => {
        const aValue = a[field] || '';
        const bValue = b[field] || '';
        if (field === 'date') {
          return isAsc
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        return isAsc
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      })
    );
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditFormData({
      patientId: record.patientId.toString() || '',
      recordId: record.recordId || '',
      diagnosis: record.diagnosis || '',
      presentingComplaint: record.presentingComplaint || '',
      familyHistory: record.familyHistory || '',
      socialHistory: record.socialHistory || '',
      pastMedicalHistory: record.pastMedicalHistory || '',
      allergies: record.allergies || '',
      medications: record.medications || '',
      date: record.date ? record.date.split('T')[0] : '',
      doctorName: record.doctorName || '',
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMedicalRecord(selectedRecord.id, {
        ...editFormData,
        patientId: parseInt(editFormData.patientId),
      });
      alert('Medical record updated successfully');
      setEditDialogOpen(false);
      setSelectedRecord(null);
      onSuccess();
    } catch (error) {
      alert('Error updating medical record');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      try {
        await deleteMedicalRecord(id);
        alert('Medical record deleted successfully');
        onSuccess();
      } catch (error) {
        alert('Error deleting medical record');
      }
    }
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleCloseAdd = () => {
    setAddDialogOpen(false);
  };

  return (
    <Box className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Medical Records</h2>
      {patients.length > 1 && (
        <Box className="mb-4 flex gap-4">
          <TextField
            select
            label="Filter by Patient"
            value={selectedPatient}
            onChange={handleFilterChange}
            className="min-w-[200px] bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="">All Patients</MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} ({patient.patientId})
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
            onClick={handleAdd}
          >
            Add Record
          </Button>
        </Box>
      )}
      {patients.length === 1 && (
        <Box className="mb-4">
          <Button
            variant="contained"
            className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
            onClick={handleAdd}
          >
            Add Record
          </Button>
        </Box>
      )}
      <TableContainer component={Paper} className="bg-hospital-white dark:bg-hospital-gray-900 rounded-md shadow-md">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'recordId'}
                  direction={sortField === 'recordId' ? sortOrder : 'asc'}
                  onClick={() => handleSort('recordId')}
                  className="text-hospital-gray-900 dark:text-hospital-white"
                >
                  Record ID
                </TableSortLabel>
              </TableCell>
              {patients.length > 1 && (
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'patientId'}
                    direction={sortField === 'patientId' ? sortOrder : 'asc'}
                    onClick={() => handleSort('patientId')}
                    className="text-hospital-gray-900 dark:text-hospital-white"
                  >
                    Patient
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'diagnosis'}
                  direction={sortField === 'diagnosis' ? sortOrder : 'asc'}
                  onClick={() => handleSort('diagnosis')}
                  className="text-hospital-gray-900 dark:text-hospital-white"
                >
                  Diagnosis
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'date'}
                  direction={sortField === 'date' ? sortOrder : 'asc'}
                  onClick={() => handleSort('date')}
                  className="text-hospital-gray-900 dark:text-hospital-white"
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'doctorName'}
                  direction={sortField === 'doctorName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('doctorName')}
                  className="text-hospital-gray-900 dark:text-hospital-white"
                >
                  Doctor
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="text-hospital-gray-900 dark:text-hospital-white">{record.recordId}</TableCell>
                {patients.length > 1 && (
                  <TableCell className="text-hospital-gray-900 dark:text-hospital-white">{record.patient?.name || 'Unknown'} ({record.patientId})</TableCell>
                )}
                <TableCell className="text-hospital-gray-900 dark:text-hospital-white">{record.diagnosis}</TableCell>
                <TableCell className="text-hospital-gray-900 dark:text-hospital-white">{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-hospital-gray-900 dark:text-hospital-white">{record.doctorName}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    className="border-hospital-accent text-hospital-accent hover:bg-hospital-accent hover:text-hospital-white rounded-md px-4 py-2 mr-2"
                    size="small"
                    onClick={() => handleView(record)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    className="border-hospital-teal-light text-hospital-teal-light hover:bg-hospital-teal-light hover:text-hospital-white rounded-md px-4 py-2 mr-2"
                    size="small"
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    className="border-hospital-error text-hospital-error hover:bg-hospital-error hover:text-hospital-white rounded-md px-4 py-2"
                    size="small"
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={viewDialogOpen} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white">Medical Record Details</DialogTitle>
        <DialogContent className="bg-hospital-white dark:bg-hospital-gray-900">
          {selectedRecord && (
            <Box className="space-y-2 text-hospital-gray-900 dark:text-hospital-white">
              <p><strong>Record ID:</strong> {selectedRecord.recordId}</p>
              <p><strong>Patient:</strong> {selectedRecord.patient?.name || 'Unknown'} ({selectedRecord.patientId})</p>
              <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</p>
              <p><strong>Presenting Complaint:</strong> {selectedRecord.presentingComplaint || 'N/A'}</p>
              <p><strong>Family History:</strong> {selectedRecord.familyHistory || 'N/A'}</p>
              <p><strong>Social History:</strong> {selectedRecord.socialHistory || 'N/A'}</p>
              <p><strong>Past Medical History:</strong> {selectedRecord.pastMedicalHistory || 'N/A'}</p>
              <p><strong>Allergies:</strong> {selectedRecord.allergies || 'N/A'}</p>
              <p><strong>Medications:</strong> {selectedRecord.medications || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}</p>
              <p><strong>Doctor:</strong> {selectedRecord.doctorName}</p>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="bg-hospital-gray-50 dark:bg-hospital-gray-800">
          <Button
            onClick={handleCloseView}
            className="border-hospital-gray-400 text-hospital-gray-400 hover:bg-hospital-gray-400 hover:text-hospital-white rounded-md px-4 py-2"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white">Edit Medical Record</DialogTitle>
        <DialogContent className="bg-hospital-white dark:bg-hospital-gray-900">
          <form onSubmit={handleEditSubmit}>
            <Box className="mt-4 space-y-4">
              <TextField
                select
                fullWidth
                label="Select Patient"
                name="patientId"
                value={editFormData.patientId}
                onChange={handleEditChange}
                required
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.patientId})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Record ID"
                name="recordId"
                value={editFormData.recordId}
                onChange={handleEditChange}
                required
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={editFormData.date}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                required
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Doctor Name"
                name="doctorName"
                value={editFormData.doctorName}
                onChange={handleEditChange}
                required
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Diagnosis"
                name="diagnosis"
                value={editFormData.diagnosis}
                onChange={handleEditChange}
                multiline
                rows={3}
                required
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Presenting Complaint"
                name="presentingComplaint"
                value={editFormData.presentingComplaint}
                onChange={handleEditChange}
                multiline
                rows={3}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Family History"
                name="familyHistory"
                value={editFormData.familyHistory}
                onChange={handleEditChange}
                multiline
                rows={3}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Social History"
                name="socialHistory"
                value={editFormData.socialHistory}
                onChange={handleEditChange}
                multiline
                rows={3}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Past Medical History"
                name="pastMedicalHistory"
                value={editFormData.pastMedicalHistory}
                onChange={handleEditChange}
                multiline
                rows={3}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Allergies"
                name="allergies"
                value={editFormData.allergies}
                onChange={handleEditChange}
                multiline
                rows={2}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
              <TextField
                fullWidth
                label="Medications"
                name="medications"
                value={editFormData.medications}
                onChange={handleEditChange}
                multiline
                rows={3}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
              />
            </Box>
            <DialogActions className="bg-hospital-gray-50 dark:bg-hospital-gray-800">
              <Button
                onClick={handleCloseEdit}
                className="border-hospital-gray-400 text-hospital-gray-400 hover:bg-hospital-gray-400 hover:text-hospital-white rounded-md px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={handleCloseAdd} maxWidth="md" fullWidth>
        <DialogTitle className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white">Add Medical Record</DialogTitle>
        <DialogContent className="bg-hospital-white dark:bg-hospital-gray-900">
          <MedicalHistoryForm
            patient={patients[0] || {}}
            onSubmit={() => {
              setAddDialogOpen(false);
              onSuccess();
            }}
          />
        </DialogContent>
        <DialogActions className="bg-hospital-gray-50 dark:bg-hospital-gray-800">
          <Button
            onClick={handleCloseAdd}
            className="border-hospital-gray-400 text-hospital-gray-400 hover:bg-hospital-gray-400 hover:text-hospital-white rounded-md px-4 py-2"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}