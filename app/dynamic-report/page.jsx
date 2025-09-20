'use client';
import React from 'react';
import DynamicReportList from './DynamicReportList';
import DynamicReportGenerator from './DynamicReportGenerator';

export default function DynamicReportPage() {
  const handleSuccess = () => {
    console.log('Dynamic report created');
  };

  return (
    <div>
      <DynamicReportGenerator onSuccess={handleSuccess} />
      <DynamicReportList />
    </div>
  );
}
