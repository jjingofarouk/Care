'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box } from '@mui/material';
import { Pill, Package, FileText } from 'lucide-react';

export default function PharmacyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/pharmacy/inventory')) return 1;
    if (pathname.includes('/pharmacy/dispense')) return 2;
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/pharmacy/prescriptions');
        break;
      case 1:
        router.push('/pharmacy/inventory');
        break;
      case 2:
        router.push('/pharmacy/dispense');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2">
        <Box className="mb-2">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Pharmacy management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            className="card rounded-lg overflow-x-auto custom-scrollbar"
          >
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Prescriptions
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Inventory
                </span>
              }
              className="text-[var(--hospital-gray-700)] font-medium text-sm uppercase tracking-wide px-3 py-2 transition-all duration-200 hover:bg-[var(--hospital-gray-50)]"
            />
            <Tab
              label={
                <span className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Dispense
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
}