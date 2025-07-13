'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import MedicationHistoryForm from '../../components/medical-records/MedicationHistoryForm';
import MedicationHistoryList from '../../components/medical-records/MedicationHistoryList';

const MedicationHistoryPage = () => {
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchMedications = async () => {
      // Simulate API call
      const mockMedications = [
        {
          id: 1,
          medicalRecordId: 1,
          medicationName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Daily',
          startDate: '2025-01-01',
          isCurrent: true,
        },
      ];
      setMedications(mockMedications);
    };
    fetchMedications();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save medication
    const newMedication = { ...formData, id: medications.length + 1 };
    setMedications([...medications, newMedication]);
    setShowForm(false);
    setSelectedMedication(null);
  };

  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setMedications(medications.filter((medication) => medication.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Medication History
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedMedication(null);
            setShowForm(true);
          }}
        >
          Add New Medication
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <MedicationHistoryForm
            initialData={selectedMedication || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <MedicationHistoryList
        medications={medications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default MedicationHistoryPage;