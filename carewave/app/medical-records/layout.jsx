'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box } from '@mui/material';

const MedicalRecordLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/medical-records/new')) return 1;
    if (pathname.includes('/medical-records/analytics')) return 2;
    if (pathname.includes('/app/patients/new')) return 3;
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/medical-records');
        break;
      case 1:
        router.push('/medical-records/new');
        break;
      case 2:
        router.push('/medical-records/analytics');
        break;
      case 3:
        router.push('/patients/new');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4">
        <Box
          className="card m-0 p-0"
          sx={{
            '& .MuiTabs-root': {
              backgroundColor: 'var(--hospital-white)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-sm)',
              overflowX: 'auto',
            },
            '& .MuiTabs-flexContainer': {
              flexWrap: 'nowrap',
            },
            '& .MuiTab-root': {
              color: 'var(--hospital-gray-700)',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.25rem 0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all var(--transition-normal)',
              minWidth: '100px',
              whiteSpace: 'nowrap',
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'var(--hospital-accent)',
              backgroundColor: 'var(--hospital-gray-50)',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--hospital-accent)',
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'auto !important',
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'var(--hospital-gray-50)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'var(--hospital-accent)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: 'var(--hospital-accent-dark)',
              },
            },
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="medical record management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            className="custom-scrollbar"
          >
            <Tab label="Medical Records" className="btn" />
            <Tab label="New Medical Record" className="btn" />
            <Tab label="Analytics" className="btn" />
            <Tab label="New Patient" className="btn" />
          </Tabs>
        </Box>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default MedicalRecordLayout;