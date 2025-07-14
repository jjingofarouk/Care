'use client';
import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import PrescriptionList from '@/components/PrescriptionList';
import pharmacyService from '@/services/pharmacyService';

export default function PharmacyHome() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await pharmacyService.getPrescriptions();
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const handlePrescriptionDeleted = (id) => {
    setPrescriptions(prescriptions.filter((prescription) => prescription.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-[var(--hospital-gray-900)]">
          Pharmacy Dashboard
        </Typography>
        <Link href="/pharmacy/prescriptions/new">
          <Button
            variant="contained"
            className="btn-primary"
            startIcon={<Plus className="h-4 w-4" />}
          >
            New Prescription
          </Button>
        </Link>
      </Box>

      {error && (
        <div className="alert alert-error mb-4">
          <span>Error: {error}</span>
        </div>
      )}

      <PrescriptionList
        prescriptions={prescriptions}
        loading={loading}
        onPrescriptionDeleted={handlePrescriptionDeleted}
      />
    </div>
  );
}