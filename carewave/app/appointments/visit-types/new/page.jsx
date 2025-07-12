'use client';
import React from 'react';
import VisitTypeForm from '@/components/appointments/VisitTypeForm';

export default function NewVisitTypePage() {
  const handleSubmit = () => {
    window.location.href = '/appointments/visit-types';
  };

  const handleCancel = () => {
    window.location.href = '/appointments/visit-types';
  };

  return (
    <div className="p-2 sm:p-4">
      <VisitTypeForm
        visitType={{}}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}