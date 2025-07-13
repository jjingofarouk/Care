import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import TravelHistoryForm from '../../components/medical-records/TravelHistoryForm';
import TravelHistoryList from '../../components/medical-records/TravelHistoryList';

const TravelHistoryPage = () => {
  const [travelHistory, setTravelHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTravelHistory, setSelectedTravelHistory] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchTravelHistory = async () => {
      // Simulate API call
      const mockTravelHistory = [
        {
          id: 1,
          medicalRecordId: 1,
          countryVisited: 'Brazil',
          dateFrom: '2025-02-01',
          dateTo: '2025-02-15',
          purpose: 'Vacation',
          travelNotes: 'No health issues reported',
        },
      ];
      setTravelHistory(mockTravelHistory);
    };
    fetchTravelHistory();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save travel history
    const newTravelHistory = { ...formData, id: travelHistory.length + 1 };
    setTravelHistory([...travelHistory, newTravelHistory]);
    setShowForm(false);
    setSelectedTravelHistory(null);
  };

  const handleEdit = (travelHistory) => {
    setSelectedTravelHistory(travelHistory);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTravelHistory(travelHistory.filter((history) => history.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Travel History
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedTravelHistory(null);
            setShowForm(true);
          }}
        >
          Add New Travel History
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <TravelHistoryForm
            initialData={selectedTravelHistory || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <TravelHistoryList
        travelHistory={travelHistory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default TravelHistoryPage;