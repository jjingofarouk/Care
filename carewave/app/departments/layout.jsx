'use client';
import React from 'react';
import { Box } from '@mui/material';

const DepartmentsLayout = ({ children }) => {
  return (
    <Box className="min-h-screen bg-[var(--hospital-gray-50)] flex flex-col w-full max-w-full p-4 sm:p-6 lg:p-8">
      {children}
    </Box>
  );
};

export default DepartmentsLayout;