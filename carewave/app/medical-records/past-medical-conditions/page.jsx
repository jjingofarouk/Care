'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import PastMedicalConditionForm from '../../components/medical-records/PastMedicalConditionForm';
import PastMedicalConditionList from '../../components/medical-records/PastMedicalConditionList';

const PastMedicalConditionsPage = () => {
  const [conditions, setConditions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchConditions = async () => {
      // Simulate API call
      const mockConditions = [
        { id: 1, medicalRecordId: 1, condition: 'Hypertension', diagnosisDate: '2020-01-01', notes: 'Managed with medication' },
      ];
      setConditions(mockConditions);
    };
    fetchConditions();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save condition
    const newCondition = { ...formData, id: conditions.length + 1 };
    setConditions([...conditions, newCondition]);
    setShowForm(false);
    setSelectedCondition(null);
  };

  const handleEdit = (condition) => {
    setSelectedCondition(condition);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Past Medical Conditions
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedCondition(null);
            setShowForm(true);
          }}
        >
          Add New Condition
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <PastMedicalConditionForm
            initialData={selectedCondition || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <PastMedicalConditionList
        conditions={conditions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default PastMedicalConditionsPage;