'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart2 } from 'lucide-react';

const MedicalRecordStats = ({ stats }) => {
  return (
    <Box className="card mb-4 p-4 w-full">
      <div className="card-header">
        <Typography className="card-title flex items-center gap-2">
          <BarChart2 size={24} />
          Statistics
        </Typography>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[var(--hospital-gray-50)] rounded-lg">
          <Typography className="text-sm text-[var(--hospital-gray-500)]">Total Records</Typography>
          <Typography className="text-2xl font-bold">{stats.totalRecords}</Typography>
        </div>
        <div className="p-4 bg-[var(--hospital-gray-50)] rounded-lg">
          <Typography className="text-sm text-[var(--hospital-gray-500)]">Total Allergies</Typography>
          <Typography className="text-2xl font-bold">{stats.totalAllergies}</Typography>
        </div>
        <div className="p-4 bg-[var(--hospital-gray-50)] rounded-lg">
          <Typography className="text-sm text-[var(--hospital-gray-500)]">Total Diagnoses</Typography>
          <Typography className="text-2xl font-bold">{stats.totalDiagnoses}</Typography>
        </div>
        <div className="p-4 bg-[var(--hospital-gray-50)] rounded-lg">
          <Typography className="text-sm text-[var(--hospital-gray-500)]">Average Records/Patient</Typography>
          <Typography className="text-2xl font-bold">{stats.averageRecordsPerPatient.toFixed(2)}</Typography>
        </div>
      </div>
    </Box>
  );
};

export default MedicalRecordStats;