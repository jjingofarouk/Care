'use client';
import React from 'react';
import BillingList from './BillingList';
import BillingForm from './BillingForm';

// Mock data for demo (replace with API calls in production)
const patients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

export default function BillingPage() {
  const handleSuccess = () => {
    console.log('Bill created');
  };

  return (
    <div>
      <BillingForm patients={patients} onSuccess={handleSuccess} />
      <BillingList />
    </div>
  );
}
