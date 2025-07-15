'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, Package } from 'lucide-react';

export default function PharmacyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/pharmacy/inventory')) return 1;
    return 0;
  });

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/pharmacy/prescriptions');
        break;
      case 1:
        router.push('/pharmacy/inventory');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1280px] p-0 mobile-full-width">
        <div className="flex border-b border-[var(--hospital-gray-200)]">
          <button
            onClick={() => handleTabChange(0)}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium uppercase tracking-wide transition-all duration-200 ${
              tabValue === 0
                ? 'text-[var(--hospital-accent)] border-b-2 border-[var(--hospital-accent)]'
                : 'text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-50)]'
            } focus:outline-2 focus:outline-[var(--hospital-accent)]`}
          >
            <FileText className="h-3.5 w-3.5" />
            Prescriptions
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium uppercase tracking-wide transition-all duration-200 ${
              tabValue === 1
                ? 'text-[var(--hospital-accent)] border-b-2 border-[var(--hospital-accent)]'
                : 'text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-50)]'
            } focus:outline-2 focus:outline-[var(--hospital-accent)]`}
          >
            <Package className="h-3.5 w-3.5" />
            Inventory
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}