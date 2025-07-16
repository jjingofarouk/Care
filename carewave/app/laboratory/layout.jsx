'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Beaker, TestTube, FileText, Droplet } from 'lucide-react';

export default function LaboratoryLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    { name: 'Lab Tests', href: '/laboratory', icon: Beaker },
    { name: 'Lab Requests', href: '/laboratory/requests', icon: FileText },
    { name: 'Lab Results', href: '/laboratory/results', icon: TestTube },
    { name: 'Samples', href: '/laboratory/samples', icon: Droplet },
  ];

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)]">
      <nav className="bg-[var(--hospital-white)] border-b border-[var(--hospital-gray-200)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center overflow-x-auto custom-scrollbar">
            <div className="flex space-x-4">
              {tabs.map((tab, index) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-[var(--transition-normal)] ${
                    pathname === tab.href
                      ? 'bg-[var(--hospital-accent)] text-[var(--hospital-white)]'
                      : 'text-[var(--hospital-gray-600)] hover:bg-[var(--hospital-gray-100)]'
                  }`}
                  style={{ zIndex: tabs.length - index }}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
