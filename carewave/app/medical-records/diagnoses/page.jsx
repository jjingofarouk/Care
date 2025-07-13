import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import DiagnosisForm from '../../components/medical-records/DiagnosisForm';
import DiagnosisList from '../../components/medical-records/DiagnosisList';

const DiagnosesPage = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchDiagnoses = async () => {
      // Simulate API call
      const mockDiagnoses = [
        { id: 1, medicalRecordId: 1, code: 'J45', description: 'Asthma', diagnosedAt: '2025-06-01' },
      ];
      setDiagnoses(mockDiagnoses);
    };
    fetchDiagnoses();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save diagnosis
    const newDiagnosis = { ...formData, id: diagnoses.length + 1 };
    setDiagnoses([...diagnoses, newDiagnosis]);
    setShowForm(false);
    setSelectedDiagnosis(null);
  };

  const handleEdit = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDiagnoses(diagnoses.filter((diagnosis) => diagnosis.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Diagnoses
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedDiagnosis(null);
            setShowForm(true);
          }}
        >
          Add New Diagnosis
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <DiagnosisForm
            initialData={selectedDiagnosis || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <DiagnosisList
        diagnoses={diagnoses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default DiagnosesPage;