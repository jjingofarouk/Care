'use client';
import React from 'react';
import DispensaryList from './DispensaryList';
import DispensaryForm from './DispensaryForm';

// Mock data for demo (replace with API calls in production)
const medications = [
  { id: 1, name: 'Paracetamol' },
  { id: 2, name: 'Ibuprofen' },
];

export default function DispensaryPage() {
  const handleSuccess = () => {
    console.log('Dispensary record created');
  };

  return (
    <div>
      <DispensaryForm medications={medications} onSuccess={handleSuccess} />
      <DispensaryList />
    </div>
  );
}
