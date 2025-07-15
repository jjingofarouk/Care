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
      <div className="w-full px-1 sm:px-2">
        <Box className="mb-1">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="ADT management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            className="card rounded-lg overflow-x-auto custom-scrollbar"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--hospital-accent)',
              },
            }}
          >
            <Tab
              label={
                <span className="flex items-center gap-1.5">
                  <Hospital className="h-3.5 w-3.5" />
                  Admissions
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-xs uppercase tracking-wide px-2 py-1.5 min-h-[2rem] transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
              sx={{
                '&.Mui-selected': {
                  color: 'var(--hospital-accent)',
                },
              }}
            />
            <Tab
              label={
                <span className="flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5" />
                  Discharges
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-xs uppercase tracking-wide px-2 py-1.5 min-h-[2rem] transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
              sx={{
                '&.Mui-selected': {
                  color: 'var(--hospital-accent)',
                },
              }}
            />
            <Tab
              label={
                <span className="flex items-center gap-1.5">
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  Transfers
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-xs uppercase tracking-wide px-2 py-1.5 min-h-[2rem] transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
              sx={{
                '&.Mui-selected': {
                  color: 'var(--hospital-accent)',
                },
              }}
            />
            <Tab
              label={
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5" />
                  Analytics
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-xs uppercase tracking-wide px-2 py-1.5 min-h-[2rem] transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
              sx={{
                '&.Mui-selected': {
                  color: 'var(--hospital-accent)',
                },
              }}
            />
          </Tabs>
        </Box>
        {children}
      </div>
    </div>
  );
};

export default AdtLayout;