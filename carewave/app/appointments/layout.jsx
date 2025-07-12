'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box } from '@mui/material';
import { Calendar, FileText, Clock } from 'lucide-react';

const AppointmentsLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/appointments/visit-types')) return 1;
    if (pathname.includes('/appointments/history')) return 2;
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/appointments');
        break;
      case 1:
        router.push('/appointments/visit-types');
        break;
      case 2:
        router.push('/appointments/history');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4">
        <Box className="mb-2">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="appointment management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            className="card rounded-lg overflow-x-auto custom-scrollbar"
          >
            <Tab 
              label={
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Appointments
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab 
              label={
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Visit Types
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab 
              label={
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status History
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
          </Tabs>
        </Box>
        {children}
      </div>
    </div>
  );
};

export default AppointmentsLayout;