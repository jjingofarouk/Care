// app/components/medical-records/MedicalRecordsLayout.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box, Typography } from '@mui/material';

const MedicalRecordsLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(0);

  // Sync tabValue with pathname to prevent hydration mismatch
  useEffect(() => {
    const pathToTab = {
      '/medical-records': 0,
      '/medical-records/allergies': 1,
      '/medical-records/diagnoses': 2,
      '/medical-records/vital-signs': 3,
      '/medical-records/chief-complaints': 4,
      '/medical-records/present-illnesses': 5,
      '/medical-records/past-conditions': 6,
      '/medical-records/surgical-history': 7,
      '/medical-records/family-history': 8,
      '/medical-records/medication-history': 9,
      '/medical-records/social-history': 10,
      '/medical-records/review-of-systems': 11,
      '/medical-records/immunizations': 12,
      '/medical-records/travel-history': 13,
    };
    setTabValue(pathToTab[pathname] || 0);
  }, [pathname]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const routes = [
      '/medical-records',
      '/medical-records/allergies',
      '/medical-records/diagnoses',
      '/medical-records/vital-signs',
      '/medical-records/chief-complaints',
      '/medical-records/present-illnesses',
      '/medical-records/past-conditions',
      '/medical-records/surgical-history',
      '/medical-records/family-history',
      '/medical-records/medication-history',
      '/medical-records/social-history',
      '/medical-records/review-of-systems',
      '/medical-records/immunizations',
      '/medical-records/travel-history',
    ];
    router.push(routes[newValue]);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4">
        <Box
          sx={{
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
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="medical records tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Overview" />
            <Tab label="Allergies" />
            <Tab label="Diagnoses" />
            <Tab label="Vital Signs" />
            <Tab label="Chief Complaints" />
            <Tab label="Present Illnesses" />
            <Tab label="Past Conditions" />
            <Tab label="Surgical History" />
            <Tab label="Family History" />
            <Tab label="Medications" />
            <Tab label="Social History" />
            <Tab label="Review of Systems" />
            <Tab label="Immunizations" />
            <Tab label="Travel History" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2 }}>
          {React.Children.count(children) > 0 ? (
            children
          ) : (
            <Typography>No content available for this section</Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default MedicalRecordsLayout;