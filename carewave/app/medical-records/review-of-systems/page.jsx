'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import ReviewOfSystemsForm from '../../components/medical-records/ReviewOfSystemsForm';
import ReviewOfSystemsList from '../../components/medical-records/ReviewOfSystemsList';

const ReviewOfSystemsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Mock fetch function - replace with actual API call
  useEffect(() => {
    const fetchReviews = async () => {
      // Simulate API call
      const mockReviews = [
        { id: 1, medicalRecordId: 1, system: 'Respiratory', findings: 'No abnormalities' },
      ];
      setReviews(mockReviews);
    };
    fetchReviews();
  }, []);

  const handleSubmit = (formData) => {
    // Simulate API call to save review
    const newReview = { ...formData, id: reviews.length + 1 };
    setReviews([...reviews, newReview]);
    setShowForm(false);
    setSelectedReview(null);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Typography variant="h4" className="mb-6 text-hospital-gray-900">
        Review of Systems
      </Typography>
      
      <Box className="mb-6">
        <Button
          variant="contained"
          startIcon={<Plus />}
          className="btn-primary"
          onClick={() => {
            setSelectedReview(null);
            setShowForm(true);
          }}
        >
          Add New Review
        </Button>
      </Box>

      {showForm && (
        <Box className="mb-6">
          <ReviewOfSystemsForm
            initialData={selectedReview || {}}
            onSubmit={handleSubmit}
            medicalRecords={[{ id: 1, patient: { name: 'John Doe' } }]} // Mock records
          />
        </Box>
      )}

      <ReviewOfSystemsList
        reviews={reviews}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default ReviewOfSystemsPage;