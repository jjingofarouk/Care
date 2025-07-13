'use client';
import React from 'react';
import MedicalRecordsView from '@/components/medical-records/MedicalRecordsView';

// Prevent static generation
export const dynamic = 'force-dynamic';

export default function MedicalRecordsPage() {
  return <MedicalRecordsView />;
}