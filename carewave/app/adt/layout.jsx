'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box } from '@mui/material';
import { Hospital, Bed, ArrowLeftRight, BarChart2 } from 'lucide-react';

const AdtLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/adt/discharges')) return 1;
    if (pathname.includes('/adt/transfers')) return 2;
    if (pathname.includes('/adt/analytics')) return 3;
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/adt/admissions');
        break;
      case 1:
        router.push('/adt/discharges');
        break;
      case 2:
        router.push('/adt/transfers');
        break;
      case 3:
        router.push('/adt/analytics');
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
            aria-label="ADT management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            className="card rounded-lg overflow-x-auto custom-scrollbar"
          >
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <Hospital className="h-4 w-4" />
                  Admissions
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Discharges
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  Transfers
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Analytics
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

export default AdtLayout;