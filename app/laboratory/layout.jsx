'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LaboratoryLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    { name: 'Lab Tests', href: '/laboratory' },
    { name: 'Lab Requests', href: '/laboratory/requests' },
    { name: 'Lab Results', href: '/laboratory/results' },
    { name: 'Samples', href: '/laboratory/samples' },
  ];

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-0">
      <nav className="bg-hospital-white border-b border-hospital-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 overflow-x-auto">
            <div className="flex space-x-4 whitespace-nowrap">
              {tabs.map((tab, index) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    pathname === tab.href
                      ? 'bg-hospital-accent text-hospital-white'
                      : 'text-hospital-gray-600 hover:bg-hospital-gray-100'
                  }`}
                  style={{ zIndex: tabs.length - index }}
                >
                  <span className="relative z-10">{tab.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}