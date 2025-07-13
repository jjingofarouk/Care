'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import FamilyHistoryForm from '../../components/medical-records/FamilyHistoryForm';
import FamilyHistoryList from '../../components/medical-records/FamilyHistoryList';

const FamilyHistoryPage = () => {
  const [familyHistory, setFamilyHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFamilyHistory, setSelectedFamilyHistory] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchFamilyHistory = async () => {
      // Simulate API call
      const mockFamilyHistory = [
        { id: 1, medicalRecordId: 1, relative: 'Mother', condition: 'Diabetes', ageAtDiagnosis: 45, notes: 'Type 2' },
      ];
      setFamilyHistory(mockFamilyHistory);
    };
    fetchFamilyHistory();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save family history
    const newFamilyHistory = { ...formData, id: familyHistory.length + 1 };
    setFamilyHistory([...familyHistory, newFamilyHistory]);
    setShowForm(false);
    setSelectedFamilyHistory(null);
  };

  const handleEdit = (familyHistory) => {
    setSelectedFamilyHistory(familyHistory);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setFamilyHistory(familyHistory.filter((history) => history.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Family History
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedFamilyHistory(null);
            setShowForm(true);
          }}
        >
          Add New Family History
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <FamilyHistoryForm
            initialData={selectedFamilyHistory || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <FamilyHistoryList
        familyHistory={familyHistory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default FamilyHistoryPage;