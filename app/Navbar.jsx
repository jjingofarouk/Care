'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CalculatorIcon,
  CogIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BeakerIcon,
  TruckIcon,
  BellAlertIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  HeartIcon,
  DocumentMagnifyingGlassIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  QueueListIcon,
  ChartBarIcon,
  UserPlusIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Patients', path: '/patient', icon: UserIcon },
  { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
  { name: 'Accounting', path: '/accounting', icon: CalculatorIcon },
  { name: 'ADT', path: '/adt', icon: DocumentTextIcon },
  { name: 'Billing', path: '/billing', icon: CurrencyDollarIcon },
  { name: 'Claim Management', path: '/claim-mgmt', icon: ShieldCheckIcon },
  { name: 'Clinical', path: '/clinical', icon: BeakerIcon },
  { name: 'CSSD', path: '/cssd', icon: TruckIcon },
  { name: 'Dispensary', path: '/dispensary', icon: BuildingStorefrontIcon },
  { name: 'Doctor', path: '/doctor', icon: UserCircleIcon },
  { name: 'Emergency', path: '/emergency', icon: BellAlertIcon },
  { name: 'Fixed Assets', path: '/fixed-assets', icon: ArchiveBoxIcon },
  { name: 'Helpdesk', path: '/helpdesk', icon: WrenchScrewdriverIcon },
  { name: 'Incentive', path: '/incentive', icon: BanknotesIcon },
  { name: 'Inventory', path: '/inventory', icon: CubeIcon },
  { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon },
  { name: 'Maternity', path: '/maternity', icon: HeartIcon },
  { name: 'Medical Records', path: '/medical-records', icon: DocumentMagnifyingGlassIcon },
  { name: 'Marketing Referral', path: '/mkt-referral', icon: UserPlusIcon },
  { name: 'NHIF', path: '/nhif', icon: ShieldCheckIcon },
  { name: 'Nursing', path: '/nursing', icon: UserPlusIcon },
  { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon },
  { name: 'Pharmacy', path: '/pharmacy', icon: BuildingStorefrontIcon },
  { name: 'Procurement', path: '/procurement', icon: TruckIcon },
  { name: 'Queue Management', path: '/queue-mngmt', icon: QueueListIcon },
  { name: 'Radiology', path: '/radiology', icon: ChartBarIcon },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'Social Service', path: '/social-service', icon: UserPlusIcon },
  { name: 'Substore', path: '/substore', icon: CubeIcon },
  { name: 'System Admin', path: '/system-admin', icon: CogIcon },
  { name: 'Utilities', path: '/utilities', icon: WrenchScrewdriverIcon },
  { name: 'Vaccination', path: '/vaccination', icon: BeakerIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navItems.map(({ name, path, icon: Icon }) => (
          <li key={path} className={styles.navItem}>
            <Link
              href={path}
              className={`${styles.navLink} ${pathname === path ? styles.active : ''}`}
            >
              <Icon className={styles.icon} />
              <span>{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}