'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import AllergyForm from '../../components/medical-records/AllergyForm';
import AllergyList from '../../components/medical-records/AllergyList';

const AllergiesPage = () => {
  const [allergies, setAllergies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchAllergies = async () => {
      // Simulate API call
      const mockAllergies = [
        { id: 1, medicalRecordId: 1, name: 'Penicillin', severity: 'Severe' },
        { id: 2, medicalRecordId: 1, name: 'Peanuts', severity: 'Moderate' },
      ];
      setAllergies(mockAllergies);
    };
    fetchAllergies();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save allergy
    const newAllergy = { ...formData, id: allergies.length + 1 };
    setAllergies([...allergies, newAllergy]);
    setShowForm(false);
    setSelectedAllergy(null);
  };

  const handleEdit = (allergy) => {
    setSelectedAllergy(allergy);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAllergies(allergies.filter((allergy) => allergy.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Allergies
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedAllergy(null);
            setShowForm(true);
          }}
        >
          Add New Allergy
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <AllergyForm
            initialData={selectedAllergy || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <AllergyList
        allergies={allergies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default AllergiesPage;