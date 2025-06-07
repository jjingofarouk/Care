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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
} from '@mui/material';
import {
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../medical-records/medicalRecordsService';
import MedicalHistoryForm from './MedicalHistoryForm';

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

  const handleView = async (id) => {
    try {
      const record = await getMedicalRecord(id);
      setSelectedRecord(record);
      setViewDialogOpen(true);
    } catch (error) {
      alert('Error fetching medical record');
    }
  };

  const handleEdit = async (id) => {
    try {
      const record = await getMedicalRecord(id);
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
    } catch (error) {
      alert('Error fetching medical record');
    }
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
    <Box>
      <Typography variant="h6" gutterBottom>Medical Records</Typography>
      {patients.length > 1 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            select
            label="Filter by Patient"
            value={selectedPatient}
            onChange={handleFilterChange}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Patients</MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} ({patient.patientId})
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add Record
          </Button>
        </Box>
      )}
      {patients.length === 1 && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add Record
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'recordId'}
                  direction={sortField === 'recordId' ? sortOrder : 'asc'}
                  onClick={() => handleSort('recordId')}
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
                >
                  Diagnosis
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'date'}
                  direction={sortField === 'date' ? sortOrder : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'doctorName'}
                  direction={sortField === 'doctorName' ? sortOrder : 'asc'}
                  onClick={() => handleSort('doctorName')}
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
                <TableCell>{record.recordId}</TableCell>
                {patients.length > 1 && (
                  <TableCell>{record.patient?.name || 'Unknown'} ({record.patientId})</TableCell>
                )}
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>{record.doctorName}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleView(record.id)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleEdit(record.id)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
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
        <DialogTitle>Medical Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Typography><strong>Record ID:</strong> {selectedRecord.recordId}</Typography>
              <Typography><strong>Patient:</strong> {selectedRecord.patient?.name || 'Unknown'} ({selectedRecord.patientId})</Typography>
              <Typography><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</Typography>
              <Typography><strong>Presenting Complaint:</strong> {selectedRecord.presentingComplaint || 'N/A'}</Typography>
              <Typography><strong>Family History:</strong> {selectedRecord.familyHistory || 'N/A'}</Typography>
              <Typography><strong>Social History:</strong> {selectedRecord.socialHistory || 'N/A'}</Typography>
              <Typography><strong>Past Medical History:</strong> {selectedRecord.pastMedicalHistory || 'N/A'}</Typography>
              <Typography><strong>Allergies:</strong> {selectedRecord.allergies || 'N/A'}</Typography>
              <Typography><strong>Medications:</strong> {selectedRecord.medications || 'N/A'}</Typography>
              <Typography><strong>Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}</Typography>
              <Typography><strong>Doctor:</strong> {selectedRecord.doctorName}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Medical Record</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                fullWidth
                label="Select Patient"
                name="patientId"
                value={editFormData.patientId}
                onChange={handleEditChange}
                required
                sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Doctor Name"
                name="doctorName"
                value={editFormData.doctorName}
                onChange={handleEditChange}
                required
                sx={{ mb: 2 }}
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
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Presenting Complaint"
                name="presentingComplaint"
                value={editFormData.presentingComplaint}
                onChange={handleEditChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Family History"
                name="familyHistory"
                value={editFormData.familyHistory}
                onChange={handleEditChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Social History"
                name="socialHistory"
                value={editFormData.socialHistory}
                onChange={handleEditChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Past Medical History"
                name="pastMedicalHistory"
                value={editFormData.pastMedicalHistory}
                onChange={handleEditChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Allergies"
                name="allergies"
                value={editFormData.allergies}
                onChange={handleEditChange}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Medications"
                name="medications"
                value={editFormData.medications}
                onChange={handleEditChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleCloseEdit} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={handleCloseAdd} maxWidth="md" fullWidth>
        <DialogTitle>Add Medical Record</DialogTitle>
        <DialogContent>
          <MedicalHistoryForm
            patient={patients[0] || {}}
            onSubmit={() => {
              setAddDialogOpen(false);
              onSuccess();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}