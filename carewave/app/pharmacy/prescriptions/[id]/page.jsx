'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';

export default function PrescriptionDetail() {
  const router = useRouter();
  const params = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrescription();
  }, []);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/prescriptions?id=${params.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrescription(data);
    } catch (err) {
      console.error('Error fetching prescription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="card w-full max-w-3xl mx-auto mt-8 p-6">
        <Typography color="error" className="mb-4">
          Error loading prescription: {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchPrescription}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!prescription) {
    return (
      <Box className="card w-full max-w-3xl mx-auto mt-8 p-6">
        <Typography className="mb-4">Prescription not found</Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/pharmacy/prescriptions')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Back to Prescriptions
        </Button>
      </Box>
    );
  }

  return (
    <Box className="card w-full max-w-3xl mx-auto mt-8 p-6">
      <Typography variant="h4" className="mb-6 text-[var(--hospital-gray-900)]">
        Prescription Details
      </Typography>

      <Box className="space-y-4">
        <Box>
          <Typography variant="subtitle2" className="text-[var(--hospital-gray-500)]">
            Patient
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {prescription.patient?.name || 'N/A'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" className="text-[var(--hospital-gray-500)]">
            Doctor
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {prescription.doctor?.name ? `Dr. ${prescription.doctor.name}` : 'N/A'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" className="text-[var(--hospital-gray-500)]">
            Drug
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {prescription.drug?.name || 'N/A'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" className="text-[var(--hospital-gray-500)]">
            Dosage
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {prescription.dosage || 'N/A'}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" className="text-[var(--hospital-gray-500)]">
            Prescribed At
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {prescription.prescribedAt
              ? format(new Date(prescription.prescribedAt), 'PPp')
              : 'N/A'}
          </Typography>
        </Box>
      </Box>

      <Box className="mt-6 flex gap-4">
        <Button
          variant="contained"
          onClick={() => router.push(`/pharmacy/prescriptions/${prescription.id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Edit Prescription
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push('/pharmacy/prescriptions')}
          className="border-[var(--hospital-gray-300)] text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-50)]"
        >
          Back to List
        </Button>
      </Box>
    </Box>
  );
}