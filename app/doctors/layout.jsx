// app/doctors/layout.jsx
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
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4">
        <Box sx={{
          borderBottom: '1px solid var(--hospital-gray-200)',
          mb: 1,
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
            color: 'var(--role-doctor)',
            backgroundColor: 'var(--hospital-gray-50)',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--role-doctor)',
            height: '3px',
            borderRadius: '3px 3px 0 0',
          },
          '& .MuiTabs-scroller': {
            overflowX: 'auto !important',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'var(--hospital-gray-50)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--hospital-gray-200)',
              borderRadius: '4px',
            },
          },
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="doctor management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Doctors" />
            <Tab label="Schedules" />
            <Tab label="Specializations" />
            <Tab label="Leaves" />
          </Tabs>
        </Box>
        {children}
      </div>
    </div>
  );
};

export default DoctorsLayout;