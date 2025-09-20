'use client';
import React from 'react';
import ClinicalSettingsList from './ClinicalSettingsList';
import ClinicalSettingsForm from './ClinicalSettingsForm';

export default function ClinicalSettingsPage() {
  const handleSuccess = () => {
    console.log('Clinical setting created');
  };

  return (
    <div>
      <ClinicalSettingsForm onSuccess={handleSuccess} />
      <ClinicalSettingsList />
    </div>
  );
}
