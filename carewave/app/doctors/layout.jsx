// DoctorsLayout.jsx
'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box } from '@mui/material';

const DoctorsLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/doctors/schedules')) return 1;
    if (pathname.includes('/doctors/specializations')) return 2;
    if (pathname.includes('/doctors/leaves')) return 3;
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/doctors');
        break;
      case 1:
        router.push('/doctors/schedules');
        break;
      case 2:
        router.push('/doctors/specializations');
        break;
      case 3:
        router.push('/doctors/leaves');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] flex flex-col w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="doctor management tabs">
          <Tab label="Doctors" />
          <Tab label="Schedules" />
          <Tab label="Specializations" />
          <Tab label="Leaves" />
        </Tabs>
      </Box>
      {children}
    </div>
  );
};

export default DoctorsLayout;