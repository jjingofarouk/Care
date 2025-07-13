'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import SurgicalHistoryForm from '../../components/medical-records/SurgicalHistoryForm';
import SurgicalHistoryList from '../../components/medical-records/SurgicalHistoryList';

const SurgicalHistoryPage = () => {
  const [surgicalHistory, setSurgicalHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchSurgicalHistory = async () => {
      // Simulate API call
      const mockSurgicalHistory = [
        { id: 1, medicalRecordId: 1, procedure: 'Appendectomy', datePerformed: '2018-03-15', outcome: 'Successful', notes: 'No complications' },
      ];
      setSurgicalHistory(mockSurgicalHistory);
    };
    fetchSurgicalHistory();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save surgery
    const newSurgery = { ...formData, id: surgicalHistory.length + 1 };
    setSurgicalHistory([...surgicalHistory, newSurgery]);
    setShowForm(false);
    setSelectedSurgery(null);
  };

  const handleEdit = (surgery) => {
    setSelectedSurgery(surgery);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSurgicalHistory(surgicalHistory.filter((surgery) => surgery.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Surgical History
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedSurgery(null);
            setShowForm(true);
          }}
        >
          Add New Surgery
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <SurgicalHistoryForm
            initialData={selectedSurgery || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <SurgicalHistoryList
        surgicalHistory={surgicalHistory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SurgicalHistoryPage;