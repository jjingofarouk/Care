import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import PresentIllnessForm from '../../components/medical-records/PresentIllnessForm';
import PresentIllnessList from '../../components/medical-records/PresentIllnessList';

const PresentIllnessesPage = () => {
  const [illnesses, setIllnesses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedIllness, setSelectedIllness] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchIllnesses = async () => {
      // Simulate API call
      const mockIllnesses = [
        {
          id: 1,
          medicalRecordId: 1,
          narrative: 'Patient reports persistent cough',
          severity: 'Moderate',
          progress: 'Improving',
          associatedSymptoms: 'Fever, fatigue',
        },
      ];
      setIllnesses(mockIllnesses);
    };
    fetchIllnesses();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save illness
    const newIllness = { ...formData, id: illnesses.length + 1 };
    setIllnesses([...illnesses, newIllness]);
    setShowForm(false);
    setSelectedIllness(null);
  };

  const handleEdit = (illness) => {
    setSelectedIllness(illness);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setIllnesses(illnesses.filter((illness) => illness.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Present Illnesses
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedIllness(null);
            setShowForm(true);
          }}
        >
          Add New Illness
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <PresentIllnessForm
            initialData={selectedIllness || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <PresentIllnessList
        illnesses={illnesses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default PresentIllnessesPage;