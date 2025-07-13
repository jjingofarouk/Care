'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import MedicalRecordForm from '../components/medical-records/MedicalRecordForm';
import MedicalRecordsList from '../components/medical-records/MedicalRecordsList';
import MedicalRecordSummary from '../components/medical-records/MedicalRecordSummary';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchRecords = async () => {
      // Simulate API call
      const mockRecords = [
        {
          id: 1,
          patient: { id: 1, name: 'John Doe' },
          recordDate: '2025-07-01',
          allergies: [{ id: 1, name: 'Penicillin', severity: 'Severe' }],
          diagnoses: [{ id: 1, code: 'J45', description: 'Asthma', diagnosedAt: '2025-06-01' }],
          vitalSigns: [{ id: 1, bloodPressure: '120/80', heartRate: 72, temperature: 36.6 }],
        },
      ];
      setRecords(mockRecords);
    };
    fetchRecords();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save record
    const newRecord = { ...formData, id: records.length + 1, patient: { id: formData.patientId, name: 'New Patient' } };
    setRecords([...records, newRecord]);
    setShowForm(false);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Medical Records
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedRecord(null);
            setShowForm(true);
          }}
        >
          Add New Record
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <MedicalRecordForm
            initialData={selectedRecord || {}}
            onSubmit={handleSubmit}
            patients={[{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]} // Mock patients
          />
        </Box>
      )}

      <MedicalRecordList
        records={records}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {selectedRecord && (
        <Box className="mt-6">
          <MedicalRecordSummary record={selectedRecord} />
        </Box>
      )}
    </Box>
  );
};

export default MedicalRecordsPage;