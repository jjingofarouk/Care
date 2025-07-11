"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon, UserIcon, CalendarIcon, CalculatorIcon, CogIcon, BeakerIcon, BriefcaseIcon,
  ClipboardDocumentListIcon, DocumentTextIcon, HeartIcon, IdentificationIcon, InboxIcon,
  KeyIcon, ShieldCheckIcon, ShoppingCartIcon, Squares2X2Icon, TableCellsIcon, UsersIcon,
  WrenchIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import useAuth from './useAuth';

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'health' },
    { name: 'Medical Records', path: '/medical-records', icon: DocumentTextIcon, category: 'health' },
    { name: 'Billing', path: '/billing', icon: TableCellsIcon, category: 'finance' },
  ],
  DOCTOR: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Patients', path: '/patient', icon: UserIcon, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: BeakerIcon, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon, category: 'clinical' },
  ],
  NURSE: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Patients', path: '/patient', icon: UserIcon, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'patient-care' },
    { name: 'Nursing', path: '/nursing', icon: HeartIcon, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: HeartIcon, category: 'nursing' },
  ],
  LAB_TECHNICIAN: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon, category: 'lab' },
    { name: 'Radiology', path: '/radiology', icon: BeakerIcon, category: 'lab' },
  ],
  STAFF: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Helpdesk', path: '/helpdesk', icon: UsersIcon, category: 'support' },
    { name: 'Inventory', path: '/inventory', icon: Squares2X2Icon, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCartIcon, category: 'operations' },
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Patients', path: '/patient', icon: UserIcon, category: 'patient-care' },
    { name: 'Doctor', path: '/doctor', icon: IdentificationIcon, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'patient-care' },
    { name: 'ADT', path: '/adt', icon: ClipboardDocumentListIcon, category: 'patient-care' },
    { name: 'Emergency', path: '/emergency', icon: XCircleIcon, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue-mgmt', icon: UsersIcon, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: BeakerIcon, category: 'clinical' },
    { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon, category: 'clinical' },
    { name: 'Radiology', path: '/radiology', icon: BeakerIcon, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon, category: 'clinical' },
    { name: 'Clinical Settings', path: '/clinical-settings', icon: WrenchIcon, category: 'clinical' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheckIcon, category: 'clinical' },
    { name: 'Nursing', path: '/nursing', icon: HeartIcon, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: HeartIcon, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: HeartIcon, category: 'nursing' },
    { name: 'Pharmacy', path: '/pharmacy', icon: InboxIcon, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: InboxIcon, category: 'pharmacy' },
    { name: 'Billing', path: '/billing', icon: TableCellsIcon, category: 'finance' },
    { name: 'Accounting', path: '/accounting', icon: CalculatorIcon, category: 'finance' },
    { name: 'Claim Management', path: '/claim-mgmt', icon: DocumentTextIcon, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheckIcon, category: 'finance' },
    { name: 'Incentive', path: '/incentive', icon: KeyIcon, category: 'finance' },
    { name: 'Inventory', path: '/inventory', icon: Squares2X2Icon, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCartIcon, category: 'operations' },
    { name: 'Substore', path: '/substore', icon: Squares2X2Icon, category: 'operations' },
    { name: 'Fixed Assets', path: '/fixed-assets', icon: BriefcaseIcon, category: 'operations' },
    { name: 'Reports', path: '/reports', icon: TableCellsIcon, category: 'reports' },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: TableCellsIcon, category: 'reports' },
    { name: 'Medical Records', path: '/medical-records', icon: DocumentTextIcon, category: 'reports' },
    { name: 'Helpdesk', path: '/helpdesk', icon: UsersIcon, category: 'support' },
    { name: 'Marketing Referral', path: '/mkt-referral', icon: UsersIcon, category: 'support' },
    { name: 'Social Service', path: '/social-service', icon: UsersIcon, category: 'support' },
    { name: 'Settings', path: '/settings', icon: CogIcon, category: 'admin' },
    { name: 'System Admin', path: '/system-admin', icon: WrenchIcon, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: WrenchIcon, category: 'admin' },
    { name: 'Verification', path: '/verification', icon: ShieldCheckIcon, category: 'admin' },
  ],
  GUEST: [
    { name: 'Home', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Login', path: '/auth/login', icon: KeyIcon, category: 'auth' },
    { name: 'Register', path: '/auth/register', icon: UserIcon, category: 'auth' },
  ],
};

const categoryLabels = {
  main: 'Overview',
  'patient-care': 'Patient Care',
  clinical: 'Clinical Services',
  nursing: 'Nursing Care',
  lab: 'Laboratory',
  pharmacy: 'Pharmacy',
  finance: 'Finance & Billing',
  operations: 'Operations',
  reports: 'Reports & Analytics',
  support: 'Support Services',
  admin: 'Administration',
  auth: 'Authentication',
  health: 'Health Services',
};

export default function Sidebar({ toggleSidebar, isOpen }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItems = user ? roleBasedNavItems[user.role] || roleBasedNavItems.GUEST : roleBasedNavItems.GUEST;
  const groupedNavItems = navItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) return null;

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--hospital-gray-900)] text-[var(--hospital-white)] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:w-72 lg:w-80`}>
      <div className="flex items-center p-4 border-b border-[var(--hospital-gray-700)] bg-gradient-to-r from-[var(--hospital-accent)] to-[var(--hospital-gray-800)]">
        <img src="/logo.png" alt="CareWave Logo" className="w-8 h-8 rounded-md mr-2" />
        <h2 className="text-lg font-bold">CareWave</h2>
        <button onClick={toggleSidebar} className="ml-auto text-[var(--hospital-white)] hover:text-[var(--hospital-accent)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)] p-4">
        {Object.entries(groupedNavItems).map(([category, items], index) => (
          <div key={category} className="mb-4">
            {index > 0 && <hr className="my-2 border-[var(--hospital-gray-700)]" />}
            <h3 className="text-xs font-semibold uppercase text-[var(--hospital-gray-500)] mb-2">{categoryLabels[category]}</h3>
            <ul className="space-y-1">
              {items.map(({ name, path, icon: Icon }) => (
                <li key={path}>
                  <Link
                    href={path}
                    onClick={toggleSidebar}
                    className={`flex items-center p-2 rounded-md text-sm hover:bg-[var(--hospital-accent)]/10 ${pathname === path ? 'bg-[var(--hospital-accent)]/20 text-[var(--hospital-accent)]' : ''}`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {user && (
        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--hospital-gray-700)] bg-[var(--hospital-gray-800)]">
          <p className="text-xs text-[var(--hospital-gray-500)]">Logged in as</p>
          <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-[var(--hospital-accent)]">{user.role?.replace('_', ' ')}</p>
        </div>
      )}
    </div>
  );
}