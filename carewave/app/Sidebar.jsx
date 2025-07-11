"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, User, Calendar, Calculator, Settings, Flask, Briefcase,
  ClipboardList, FileText, Heart, Badge, Inbox,
  Key, ShieldCheck, ShoppingCart, Grid3X3, Table, Users,
  Wrench, X, Stethoscope, Syringe, Pill, Headphones,
  ScanLine, Scissors, DollarSign, Building2, HardHat, Lock,
} from 'lucide-react';
import useAuth from './useAuth';

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'health' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, category: 'health' },
    { name: 'Billing', path: '/billing', icon: Table, category: 'finance' },
  ],
  DOCTOR: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: Stethoscope, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: Scissors, category: 'clinical' },
  ],
  NURSE: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'Nursing', path: '/nursing', icon: Heart, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: Heart, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: Syringe, category: 'nursing' },
  ],
  LAB_TECHNICIAN: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Laboratory', path: '/laboratory', icon: Flask, category: 'lab' },
  ],
  PHARMACIST: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Pharmacy', path: '/pharmacy', icon: Pill, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: Inbox, category: 'pharmacy' },
  ],
  RECEPTIONIST: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue-mgmt', icon: Users, category: 'patient-care' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Headphones, category: 'support' },
  ],
  RADIOLOGIST: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Radiology', path: '/radiology', icon: ScanLine, category: 'lab' },
  ],
  SURGEON: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: Scissors, category: 'clinical' },
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Doctors', path: '/doctor', icon: Badge, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'ADT', path: '/adt', icon: ClipboardList, category: 'patient-care' },
    { name: 'Emergency', path: '/emergency', icon: X, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue-mgmt', icon: Users, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: Stethoscope, category: 'clinical' },
    { name: 'Laboratory', path: '/laboratory', icon: Flask, category: 'clinical' },
    { name: 'Radiology', path: '/radiology', icon: ScanLine, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: Scissors, category: 'clinical' },
    { name: 'Clinical Settings', path: '/clinical-settings', icon: Wrench, category: 'clinical' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheck, category: 'clinical' },
    { name: 'Nursing', path: '/nursing', icon: Heart, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: Heart, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: Syringe, category: 'nursing' },
    { name: 'Pharmacy', path: '/pharmacy', icon: Pill, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: Inbox, category: 'pharmacy' },
    { name: 'Billing', path: '/billing', icon: Table, category: 'finance' },
    { name: 'Accounting', path: '/accounting', icon: Calculator, category: 'finance' },
    { name: 'Claim Management', path: '/claim-mgmt', icon: FileText, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheck, category: 'finance' },
    { name: 'Incentive', path: '/incentive', icon: DollarSign, category: 'finance' },
    { name: 'Inventory', path: '/inventory', icon: Grid3X3, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart, category: 'operations' },
    { name: 'Substore', path: '/substore', icon: Grid3X3, category: 'operations' },
    { name: 'Fixed Assets', path: '/fixed-assets', icon: Briefcase, category: 'operations' },
    { name: 'Reports', path: '/reports', icon: Table, category: 'reports' },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: Table, category: 'reports' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, category: 'reports' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Headphones, category: 'support' },
    { name: 'Marketing Referral', path: '/mkt-referral', icon: Users, category: 'support' },
    { name: 'Social Service', path: '/social-service', icon: Users, category: 'support' },
    { name: 'Settings', path: '/settings', icon: Settings, category: 'admin' },
    { name: 'System Admin', path: '/system-admin', icon: Wrench, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: Wrench, category: 'admin' },
    { name: 'Verification', path: '/verification', icon: ShieldCheck, category: 'admin' },
  ],
  STAFF: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Headphones, category: 'support' },
    { name: 'Inventory', path: '/inventory', icon: Grid3X3, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart, category: 'operations' },
  ],
  ACCOUNTANT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Accounting', path: '/accounting', icon: Calculator, category: 'finance' },
    { name: 'Billing', path: '/billing', icon: Table, category: 'finance' },
  ],
  BILLING_OFFICER: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Billing', path: '/billing', icon: Table, category: 'finance' },
    { name: 'Claim Management', path: '/claim-mgmt', icon: FileText, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheck, category: 'finance' },
  ],
  HOSPITAL_MANAGER: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Reports', path: '/reports', icon: Table, category: 'reports' },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: Table, category: 'reports' },
    { name: 'Departments', path: '/departments', icon: Building2, category: 'admin' },
    { name: 'Settings', path: '/settings', icon: Settings, category: 'admin' },
  ],
  IT_SUPPORT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'System Admin', path: '/system-admin', icon: Wrench, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: Wrench, category: 'admin' },
  ],
  CLEANING_STAFF: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheck, category: 'operations' },
  ],
  SECURITY: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Security', path: '/security', icon: Lock, category: 'operations' },
  ],
  GUEST: [
    { name: 'Home', path: '/', icon: Home, category: 'main' },
    { name: 'Login', path: '/auth/login', icon: Key, category: 'auth' },
    { name: 'Register', path: '/auth/register', icon: User, category: 'auth' },
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