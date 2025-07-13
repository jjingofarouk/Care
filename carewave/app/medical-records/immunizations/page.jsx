'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import ImmunizationForm from '../../components/medical-records/ImmunizationForm';
import ImmunizationList from '../../components/medical-records/ImmunizationList';

const ImmunizationsPage = () => {
  const [immunizations, setImmunizations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedImmunization, setSelectedImmunization] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchImmunizations = async () => {
      // Simulate API call
      const mockImmunizations = [
        { id: 1, medicalRecordId: 1, vaccine: 'MMR', dateGiven: '2025-05-01', administeredBy: 'Dr. Smith', notes: 'No adverse reactions' },
      ];
      setImmunizations(mockImmunizations);
    };
    fetchImmunizations();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save immunization
    const newImmunization = { ...formData, id: immunizations.length + 1 };
    setImmunizations([...immunizations, newImmunization]);
    setShowForm(false);
    setSelectedImmunization(null);
  };

  const handleEdit = (immunization) => {
    setSelectedImmunization(immunization);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setImmunizations(immunizations.filter((immunization) => immunization.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Immunizations
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedImmunization(null);
            setShowForm(true);
          }}
        >
          Add New Immunization
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <ImmunizationForm
            initialData={selectedImmunization || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <ImmunizationList
        immunizations={immunizations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default ImmunizationsPage;