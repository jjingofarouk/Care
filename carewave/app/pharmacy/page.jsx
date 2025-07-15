'use client';
import React, { useState, useEffect } from 'react';
import PrescriptionList from '@/components/pharmacy/PrescriptionList';
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
    <div className="max-w-[1280px] mx-auto p-0 mobile-full-width">
      <PrescriptionList
        prescriptions={prescriptions}
        loading={loading}
        onPrescriptionDeleted={handlePrescriptionDeleted}
      />
    </div>
  );
}