// app/radiology/layout.js
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TestTube, Image, FileText } from 'lucide-react';

export default function RadiologyLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    { name: 'Dashboard', href: '/radiology', icon: Home },
    { name: 'Tests', href: '/radiology/tests', icon: TestTube },
    { name: 'Orders', href: '/radiology/orders', icon: FileText },
    { name: 'Results', href: '/radiology/results', icon: FileText },
    { name: 'Scan Images', href: '/radiology/scan-images', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-0">
      <nav className="bg-hospital-white border-b border-hospital-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 overflow-x-auto">
            <div className="flex space-x-4 whitespace-nowrap">
              {tabs.map((tab, index) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 ${
                    pathname === tab.href
                      ? 'bg-hospital-accent text-hospital-white'
                      : 'text-hospital-gray-600 hover:bg-hospital-gray-100'
                  }`}
                  style={{ zIndex: tabs.length - index }}
                >
                  <tab.icon className="h-4 w-4" />
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
