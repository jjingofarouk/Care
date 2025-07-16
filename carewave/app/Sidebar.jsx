"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home, 
  User, 
  Calendar, 
  Calculator, 
  Settings, 
  Briefcase,
  ClipboardList, 
  FileText, 
  Heart, 
  Badge, 
  Inbox,
  Key, 
  ShieldCheck, 
  ShoppingCart, 
  Grid3X3, 
  Users,
  Wrench, 
  X, 
  Stethoscope, 
  Syringe, 
  Pill, 
  Headphones,
  ScanLine, 
  Scissors, 
  DollarSign, 
  Building2, 
  Activity,
  AlertCircle,
  BookOpen,
  CreditCard,
  Database,
  FileBarChart,
  HelpCircle,
  Monitor,
  Package,
  Phone,
  Search,
  Shield,
  Star,
  TrendingUp,
  UserCheck,
  Zap,
  Video // Added Video icon for telemedicine
} from 'lucide-react';
import { useAuth } from './auth/AuthContext';

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Telemedicine', path: '/telemedicine', icon: Video, category: 'health' }, // Added Telemedicine
    { name: 'My Appointments', path: '/appointments', icon: Calendar, category: 'health' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, category: 'health' },
    { name: 'Test Results', path: '/test-results', icon: FileBarChart, category: 'health' },
    { name: 'Prescriptions', path: '/prescriptions', icon: Pill, category: 'health' },
    { name: 'Billing & Payments', path: '/billing', icon: CreditCard, category: 'finance' },
  ],
  DOCTOR: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Telemedicine', path: '/telemedicine', icon: Video, category: 'clinical' }, // Added Telemedicine
    { name: 'My Patients', path: '/patients', icon: User, category: 'patient-care' },
    { name: 'Appointments', path: '/appointments', icon: Calendar, category: 'patient-care' },
    { name: 'Clinical Notes', path: '/clinical', icon: Stethoscope, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: Scissors, category: 'clinical' },
    { name: 'Lab Results', path: '/lab-results', icon: Activity, category: 'clinical' },
    { name: 'Prescriptions', path: '/prescriptions', icon: Pill, category: 'clinical' },
  ],
  NURSE: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patient Care', path: '/patients', icon: User, category: 'patient-care' },
    { name: 'Appointments', path: '/appointments', icon: Calendar, category: 'patient-care' },
    { name: 'Nursing Tasks', path: '/nursing', icon: Heart, category: 'nursing' },
    { name: 'Maternity Ward', path: '/maternity', icon: Heart, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: Syringe, category: 'nursing' },
    { name: 'Medication', path: '/medication', icon: Pill, category: 'nursing' },
  ],
  LAB_TECHNICIAN: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Laboratory', path: '/laboratory', icon: Badge, category: 'lab' },
    { name: 'Test Results', path: '/test-results', icon: FileBarChart, category: 'lab' },
    { name: 'Sample Tracking', path: '/sample-tracking', icon: Search, category: 'lab' },
  ],
  PHARMACIST: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Pharmacy', path: '/pharmacy', icon: Pill, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: Inbox, category: 'pharmacy' },
    { name: 'Inventory', path: '/pharmacy-inventory', icon: Package, category: 'pharmacy' },
    { name: 'Prescriptions', path: '/prescriptions', icon: FileText, category: 'pharmacy' },
  ],
  RECEPTIONIST: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Appointments', path: '/appointments', icon: Calendar, category: 'patient-care' },
    { name: 'Patient Registration', path: '/patient-registration', icon: UserCheck, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue', icon: Users, category: 'patient-care' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Headphones, category: 'support' },
  ],
  RADIOLOGIST: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Radiology', path: '/radiology', icon: ScanLine, category: 'lab' },
    { name: 'Imaging Reports', path: '/imaging-reports', icon: FileBarChart, category: 'lab' },
    { name: 'Scan Schedule', path: '/scan-schedule', icon: Calendar, category: 'lab' },
  ],
  SURGEON: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'My Patients', path: '/patients', icon: User, category: 'patient-care' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: Scissors, category: 'clinical' },
    { name: 'Surgery Schedule', path: '/surgery-schedule', icon: Calendar, category: 'clinical' },
    { name: 'Post-Op Care', path: '/post-op-care', icon: Heart, category: 'clinical' },
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patients', icon: User, category: 'patient-care' },
    { name: 'Doctors', path: '/doctors', icon: Badge, category: 'patient-care' },
    { name: 'Appointments', path: '/appointments', icon: Calendar, category: 'patient-care' },
    { name: 'ADT', path: '/adt', icon: ClipboardList, category: 'patient-care' },
    { name: 'Emergency', path: '/emergency', icon: AlertCircle, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue', icon: Users, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: Stethoscope, category: 'clinical' },
    { name: 'Laboratory', path: '/laboratory', icon: Badge, category: 'clinical' },
    { name: 'Radiology', path: '/radiology', icon: ScanLine, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: Scissors, category: 'clinical' },
    { name: 'Clinical Settings', path: '/clinical-settings', icon: Wrench, category: 'clinical' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheck, category: 'clinical' },
    { name: 'Nursing', path: '/nursing', icon: Heart, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: Heart, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: Syringe, category: 'nursing' },
    { name: 'Pharmacy', path: '/pharmacy', icon: Pill, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: Inbox, category: 'pharmacy' },
    { name: 'Billing', path: '/billing', icon: CreditCard, category: 'finance' },
    { name: 'Accounting', path: '/accounting', icon: Calculator, category: 'finance' },
    { name: 'Claim Management', path: '/claim-mgmt', icon: FileText, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheck, category: 'finance' },
    { name: 'Incentive', path: '/incentive', icon: DollarSign, category: 'finance' },
    { name: 'Inventory', path: '/inventory', icon: Package, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart, category: 'operations' },
    { name: 'Substore', path: '/substore', icon: Grid3X3, category: 'operations' },
    { name: 'Fixed Assets', path: '/fixed-assets', icon: Briefcase, category: 'operations' },
    { name: 'Reports', path: '/reports', icon: FileBarChart, category: 'reports' },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: TrendingUp, category: 'reports' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, category: 'reports' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Headphones, category: 'support' },
    { name: 'Marketing Referral', path: '/mkt-referral', icon: Users, category: 'support' },
    { name: 'Social Service', path: '/social-service', icon: Users, category: 'support' },
    { name: 'Departments', path: '/departments', icon: Building2, category: 'admin' },
    { name: 'Settings', path: '/settings', icon: Settings, category: 'admin' },
    { name: 'System Admin', path: '/system-admin', icon: Monitor, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: Wrench, category: 'admin' },
    { name: 'Verification', path: '/verification', icon: ShieldCheck, category: 'admin' },
  ],
  STAFF: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Headphones, category: 'support' },
    { name: 'Inventory', path: '/inventory', icon: Package, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart, category: 'operations' },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench, category: 'operations' },
  ],
  ACCOUNTANT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Accounting', path: '/accounting', icon: Calculator, category: 'finance' },
    { name: 'Billing', path: '/billing', icon: CreditCard, category: 'finance' },
    { name: 'Financial Reports', path: '/financial-reports', icon: FileBarChart, category: 'finance' },
    { name: 'Payments', path: '/payments', icon: DollarSign, category: 'finance' },
  ],
  BILLING_OFFICER: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Billing', path: '/billing', icon: CreditCard, category: 'finance' },
    { name: 'Claims', path: '/claim-mgmt', icon: FileText, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheck, category: 'finance' },
    { name: 'Payments', path: '/payments', icon: DollarSign, category: 'finance' },
  ],
  HOSPITAL_MANAGER: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp, category: 'reports' },
    { name: 'Reports', path: '/reports', icon: FileBarChart, category: 'reports' },
    { name: 'Departments', path: '/departments', icon: Building2, category: 'admin' },
    { name: 'Performance', path: '/performance', icon: Star, category: 'admin' },
    { name: 'Settings', path: '/settings', icon: Settings, category: 'admin' },
  ],
  IT_SUPPORT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'System Admin', path: '/system-admin', icon: Monitor, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: Wrench, category: 'admin' },
    { name: 'Network', path: '/network', icon: Zap, category: 'admin' },
    { name: 'Backups', path: '/backups', icon: Database, category: 'admin' },
  ],
  CLEANING_STAFF: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheck, category: 'operations' },
    { name: 'Schedules', path: '/cleaning-schedules', icon: Calendar, category: 'operations' },
    { name: 'Supplies', path: '/cleaning-supplies', icon: Package, category: 'operations' },
  ],
  SECURITY: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Security', path: '/security', icon: Shield, category: 'operations' },
    { name: 'Visitor Log', path: '/visitor-log', icon: BookOpen, category: 'operations' },
    { name: 'Incident Reports', path: '/incident-reports', icon: AlertCircle, category: 'operations' },
  ],
  GUEST: [
    { name: 'Home', path: '/', icon: Home, category: 'main' },
    { name: 'Login', path: '/auth', icon: Key, category: 'auth' },
    { name: 'Register', path: '/auth', icon: User, category: 'auth' },
    { name: 'Contact', path: '/contact', icon: Phone, category: 'auth' },
    { name: 'About', path: '/about', icon: HelpCircle, category: 'auth' },
  ],
};

const categoryLabels = {
  main: 'Overview',
  'patient-care': 'Patient Care',
  clinical: 'Clinical Services',
  nursing: 'Nursing Care',
  lab: 'Laboratory & Diagnostics',
  pharmacy: 'Pharmacy',
  finance: 'Finance & Billing',
  operations: 'Operations',
  reports: 'Reports & Analytics',
  support: 'Support Services',
  admin: 'Administration',
  auth: 'Authentication',
  health: 'Health Services',
};

const categoryIcons = {
  main: Home,
  'patient-care': User,
  clinical: Stethoscope,
  nursing: Heart,
  lab: Badge,
  pharmacy: Pill,
  finance: CreditCard,
  operations: Wrench,
  reports: FileBarChart,
  support: Headphones,
  admin: Settings,
  auth: Key,
  health: Activity,
};

export default function Sidebar({ toggleSidebar, isOpen }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItems = user ? roleBasedNavItems[user?.role] || roleBasedNavItems.GUEST : roleBasedNavItems.GUEST;
  const groupedNavItems = navItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) return null;

  return (
    <div className={`fixed inset-y-0 left-0 z-[60] w-64 bg-gradient-to-b from-[var(--hospital-gray-900)] to-[var(--hospital-gray-800)] text-[var(--hospital-white)] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:w-72 lg:w-80 shadow-xl mt-16 lg:mt-20`}>
      <div className="flex items-center p-4 border-b border-[var(--hospital-gray-700)] bg-gradient-to-r from-[var(--hospital-accent)] to-[var(--hospital-gray-800)]">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg mr-3">
          <Image 
            src="/logo.png" 
            alt="CareWave Logo" 
            width={40} 
            height={40} 
            className="object-cover" 
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold">CareWave</h2>
          <p className="text-xs text-[var(--hospital-gray-300)]">Hospital Management</p>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="ml-auto text-[var(--hospital-white)] hover:text-[var(--hospital-accent)] p-2 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-8rem)] p-4 custom-scrollbar">
        {Object.entries(groupedNavItems).map(([category, items], index) => {
          const CategoryIcon = categoryIcons[category] || Home;
          return (
            <div key={category} className="mb-6">
              {index > 0 && <hr className="my-4 border-[var(--hospital-gray-700)]" />}
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon className="w-4 h-4 text-[var(--hospital-accent)]" />
                <h3 className="text-xs font-semibold uppercase text-[var(--hospital-gray-400)] tracking-wider">
                  {categoryLabels[category]}
                </h3>
              </div>
              <ul className="space-y-1">
                {items.map(({ name, path, icon: Icon }) => {
                  const isActive = pathname === path;
                  return (
                    <li key={path}>
                      <Link
                        href={path}
                        onClick={toggleSidebar}
                        className={`flex items-center p-3 rounded-lg text-sm transition-all duration-200 group ${
                          isActive 
                            ? 'bg-[var(--hospital-accent)] text-[var(--hospital-white)] shadow-lg' 
                            : 'hover:bg-[var(--hospital-gray-700)] hover:text-[var(--hospital-accent)]'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                          isActive ? 'text-[var(--hospital-white)]' : 'text-[var(--hospital-gray-400)] group-hover:text-[var(--hospital-accent)]'
                        } group-hover:scale-110`} />
                        <span className="font-medium">{name}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-[var(--hospital-white)] rounded-full"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      
      {user && (
        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--hospital-gray-700)] bg-gradient-to-r from-[var(--hospital-gray-800)] to-[var(--hospital-gray-900)]">
          <div className="flex items-center gap-3 p-3 bg-[var(--hospital-gray-700)]/50 rounded-lg">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--hospital-white)] font-bold shadow-sm"
              style={{ 
                backgroundColor: user.role === 'DOCTOR' ? '#7c3aed' : 
                               user.role === 'NURSE' ? '#dc2626' : 
                               user.role === 'ADMIN' ? '#64748b' :
                               user.role === 'RECEPTIONIST' ? '#10b981' :
                               user.role === 'RADIOLOGIST' ? '#f97316' :
                               user.role === 'SURGEON' ? '#8b5cf6' :
                               user.role === 'ACCOUNTANT' ? '#6b7280' :
                               user.role === 'BILLING_OFFICER' ? '#ef4444' :
                               user.role === 'HOSPITAL_MANAGER' ? '#3b82f6' :
                               user.role === 'IT_SUPPORT' ? '#d97706' :
                               user.role === 'CLEANING_STAFF' ? '#6d28d9' :
                               user.role === 'SECURITY' ? '#475569' : '#059669'
              }}
            >
              {user.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--hospital-white)] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[var(--hospital-accent)] truncate">
                {user.role?.replace('_', ' ')}
              </p>
            </div>
            <div className="w-2 h-2 bg-[var(--hospital-accent)] rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}