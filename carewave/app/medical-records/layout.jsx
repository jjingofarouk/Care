'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box, Button, Drawer, Divider, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import MedicalRecordForm from '../components/medical-records/MedicalRecordForm';
import MedicalRecordSummary from '../components/medical-records/MedicalRecordSummary';

const MedicalRecordsLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/medical-records/allergies')) return 1;
    if (pathname.includes('/medical-records/diagnoses')) return 2;
    if (pathname.includes('/medical-records/vital-signs')) return 3;
    if (pathname.includes('/medical-records/chief-complaints')) return 4;
    if (pathname.includes('/medical-records/present-illnesses')) return 5;
    if (pathname.includes('/medical-records/past-medical-conditions')) return 6;
    if (pathname.includes('/medical-records/surgical-history')) return 7;
    if (pathname.includes('/medical-records/family-history')) return 8;
    if (pathname.includes('/medical-records/medication-history')) return 9;
    if (pathname.includes('/medical-records/social-history')) return 10;
    if (pathname.includes('/medical-records/review-of-systems')) return 11;
    if (pathname.includes('/medical-records/immunizations')) return 12;
    if (pathname.includes('/medical-records/travel-history')) return 13;
    return 0;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0: router.push('/medical-records'); break;
      case 1: router.push('/medical-records/allergies'); break;
      case 2: router.push('/medical-records/diagnoses'); break;
      case 3: router.push('/medical-records/vital-signs'); break;
      case 4: router.push('/medical-records/chief-complaints'); break;
      case 5: router.push('/medical-records/present-illnesses'); break;
      case 6: router.push('/medical-records/past-medical-conditions'); break;
      case 7: router.push('/medical-records/surgical-history'); break;
      case 8: router.push('/medical-records/family-history'); break;
      case 9: router.push('/medical-records/medication-history'); break;
      case 10: router.push('/medical-records/social-history'); break;
      case 11: router.push('/medical-records/review-of-systems'); break;
      case 12: router.push('/medical-records/immunizations'); break;
      case 13: router.push('/medical-records/travel-history'); break;
    }
  };

  const handleNewRecord = () => {
    setSelectedRecord(null);
    setDrawerOpen(true);
  };

  const handleSubmit = () => {
    // Simulate API call to save record
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{
            flexGrow: 1,
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
          <Button
            variant="contained"
            startIcon={<Plus />}
            className="btn-primary"
            onClick={handleNewRecord}
            sx={{ height: 'fit-content', alignSelf: 'center' }}
          >
            New Record
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: { xs: '100%', sm: '500px', md: '600px' },
                p: 2,
                bgcolor: 'var(--hospital-gray-50)',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedRecord ? 'Edit Medical Record' : 'New Medical Record'}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <MedicalRecordForm
                initialData={selectedRecord || {}}
                onSubmit={handleSubmit}
                patients={[{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]}
              />
            </Box>
          </Drawer>
        </Box>

        {selectedRecord && (
          <Box sx={{ mt: 2 }}>
            <MedicalRecordSummary record={selectedRecord} />
          </Box>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsLayout;