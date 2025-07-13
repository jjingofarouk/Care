import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import VitalSignForm from '../../components/medical-records/VitalSignForm';
import VitalSignList from '../../components/medical-records/VitalSignList';

const VitalSignsPage = () => {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVitalSign, setSelectedVitalSign] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchVitalSigns = async () => {
      // Simulate API call
      const mockVitalSigns = [
        {
          id: 1,
          medicalRecordId: 1,
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 36.6,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          recordedAt: '2025-07-01',
        },
      ];
      setVitalSigns(mockVitalSigns);
    };
    fetchVitalSigns();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save vital sign
    const newVitalSign = { ...formData, id: vitalSigns.length + 1 };
    setVitalSigns([...vitalSigns, newVitalSign]);
    setShowForm(false);
    setSelectedVitalSign(null);
  };

  const handleEdit = (vitalSign) => {
    setSelectedVitalSign(vitalSign);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setVitalSigns(vitalSigns.filter((vitalSign) => vitalSign.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Vital Signs
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedVitalSign(null);
            setShowForm(true);
          }}
        >
          Add New Vital Sign
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <VitalSignForm
            initialData={selectedVitalSign || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <VitalSignList
        vitalSigns={vitalSigns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default VitalSignsPage;