import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import ChiefComplaintForm from '../../components/medical-records/ChiefComplaintForm';
import ChiefComplaintList from '../../components/medical-records/ChiefComplaintList';

const ChiefComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchComplaints = async () => {
      // Simulate API call
      const mockComplaints = [
        { id: 1, medicalRecordId: 1, description: 'Chest pain', duration: '2 days', onset: 'Sudden' },
      ];
      setComplaints(mockComplaints);
    };
    fetchComplaints();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save complaint
    const newComplaint = { ...formData, id: complaints.length + 1 };
    setComplaints([...complaints, newComplaint]);
    setShowForm(false);
    setSelectedComplaint(null);
  };

  const handleEdit = (complaint) => {
    setSelectedComplaint(complaint);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setComplaints(complaints.filter((complaint) => complaint.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Chief Complaints
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedComplaint(null);
            setShowForm(true);
          }}
        >
          Add New Complaint
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <ChiefComplaintForm
            initialData={selectedComplaint || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <ChiefComplaintList
        complaints={complaints}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default ChiefComplaintsPage;