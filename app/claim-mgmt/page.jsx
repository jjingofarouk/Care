'use client';
import React from 'react';
import ClaimList from './ClaimList';
import ClaimForm from './ClaimForm';

// Mock data for demo (replace with API calls in production)
const patients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

export default function ClaimPage() {
  const handleSuccess = () => {
    console.log('Claim created');
  };

  return (
    <div>
      <ClaimForm patients={patients} onSuccess={handleSuccess} />
      <ClaimList />
    </div>
  );
}
