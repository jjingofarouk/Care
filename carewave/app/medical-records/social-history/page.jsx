'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import SocialHistoryForm from '../../components/medical-records/SocialHistoryForm';
import SocialHistoryList from '../../components/medical-records/SocialHistoryList';

const SocialHistoryPage = () => {
  const [socialHistory, setSocialHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSocialHistory, setSelectedSocialHistory] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchSocialHistory = async () => {
      // Simulate API call
      const mockSocialHistory = [
        {
          id: 1,
          medicalRecordId: 1,
          smokingStatus: 'Non-smoker',
          alcoholUse: 'Occasional',
          occupation: 'Teacher',
          maritalStatus: 'Married',
          livingSituation: 'Lives with family',
        },
      ];
      setSocialHistory(mockSocialHistory);
    };
    fetchSocialHistory();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save social history
    const newSocialHistory = { ...formData, id: socialHistory.length + 1 };
    setSocialHistory([...socialHistory, newSocialHistory]);
    setShowForm(false);
    setSelectedSocialHistory(null);
  };

  const handleEdit = (socialHistory) => {
    setSelectedSocialHistory(socialHistory);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSocialHistory(socialHistory.filter((history) => history.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Social History
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedSocialHistory(null);
            setShowForm(true);
          }}
        >
          Add New Social History
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <SocialHistoryForm
            initialData={selectedSocialHistory || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <SocialHistoryList
        socialHistory={socialHistory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default SocialHistoryPage;