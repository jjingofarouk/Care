"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, BellIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import useAuth from './useAuth';
import Sidebar from './Sidebar';

const roleColors = {
  PATIENT: '#059669',
  DOCTOR: '#7c3aed',
  NURSE: '#dc2626',
  LAB_TECHNICIAN: '#ea580c',
  STAFF: '#0891b2',
  ADMIN: '#64748b',
  GUEST: '#374151'
};

const roleDisplayNames = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  LAB_TECHNICIAN: 'Lab Tech',
  STAFF: 'Staff',
  ADMIN: 'Administrator',
  GUEST: 'Guest'
};

export default function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  const userMenuItems = user ? [
    { name: 'Profile', path: '/profile', icon: UserIcon, description: 'View and edit your profile' },
    { name: 'Settings', path: '/settings', icon: CogIcon, description: 'Application preferences' },
    { name: 'Logout', path: '#', onClick: handleLogout, icon: ArrowRightOnRectangleIcon, description: 'Sign out of your account', danger: true },
  ] : [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Login', path: '/auth/login', icon: UserIcon },
    { name: 'Register', path: '/auth/register', icon: UserIcon },
  ];

  const notifications = [
    { id: 1, title: 'New appointment scheduled', time: '5 min ago', unread: true },
    { id: 2, title: 'Lab results available', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance tonight', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  if (loading) return null;

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-[var(--hospital-white)] border-b border-[var(--hospital-gray-200)] shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:h-20">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-2 text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-200)] rounded-md"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="CareWave Logo"
                width={40}
                height={40}
                className="rounded-md"
                priority
              />
              <span className="hidden sm:block text-xl font-bold text-[var(--hospital-gray-900)]">CareWave</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={toggleNotification}
                className="relative p-2 text-[var(--hospital-gray-700)] hover:text-[var(--hospital-accent)]"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[var(--hospital-error)] text-[var(--hospital-white)] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-[var(--hospital-gray-200)]"
              aria-label="User menu"
            >
              {user ? (
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--hospital-white)] font-semibold"
                  style={{ backgroundColor: roleColors[user.role] || '#64748b' }}
                >
                  {user.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
              ) : (
                <UserIcon className="w-8 h-8 text-[var(--hospital-gray-700)]" />
              )}
              {user && (
                <span className="hidden lg:block text-sm text-[var(--hospital-gray-900)]">
                  {user.firstName} {user.lastName}
                </span>
              )}
            </button>
          </div>
        </div>

        {userMenuOpen && (
          <div className="fixed top-16 sm:top-20 right-4 bg-[var(--hospital-white)] rounded-lg shadow-lg border border-[var(--hospital-gray-200)] w-64 max-h-[calc(100vh-5rem)] overflow-y-auto z-[1000]">
            {user && (
              <div className="p-4 border-b border-[var(--hospital-gray-200)]">
                <p className="text-sm font-semibold text-[var(--hospital-gray-900)]">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[var(--hospital-gray-500)]">{roleDisplayNames[user.role]}</p>
              </div>
            )}
            {userMenuItems.map(({ name, path, onClick, icon: Icon, description, danger }) => (
              <Link
                key={path}
                href={onClick ? '#' : path}
                onClick={onClick || (() => setUserMenuOpen(false))}
                className={`flex items-center gap-3 p-3 hover:bg-[var(--hospital-accent)]/10 text-sm ${danger ? 'hover:bg-[var(--hospital-error)]/10 hover:text-[var(--hospital-error)]' : 'text-[var(--hospital-gray-900)]'}`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <p className="font-medium">{name}</p>
                  {description && <p className="text-xs text-[var(--hospital-gray-500)]">{description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {notificationOpen && user && (
          <div className="fixed top-16 sm:top-20 right-4 bg-[var(--hospital-white)] rounded-lg shadow-lg border border-[var(--hospital-gray-200)] w-64 max-h-[calc(100vh-5rem)] overflow-y-auto z-[1000]">
            <div className="p-4 border-b border-[var(--hospital-gray-200)]">
              <p className="text-sm font-semibold text-[var(--hospital-gray-900)]">Notifications</p>
            </div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-l-4 ${notification.unread ? 'border-[var(--hospital-accent)] bg-[var(--hospital-accent)]/5' : 'border-transparent'}`}
                onClick={() => setNotificationOpen(false)}
              >
                <p className={`text-sm ${notification.unread ? 'font-semibold' : 'font-normal'} text-[var(--hospital-gray-900)]`}>{notification.title}</p>
                <p className="text-xs text-[var(--hospital-gray-500)]">{notification.time}</p>
              </div>
            ))}
            <div className="p-3 border-t border-[var(--hospital-gray-200)]">
              <p className="text-sm text-[var(--hospital-accent)] font-medium cursor-pointer hover:underline">View all notifications</p>
            </div>
          </div>
        )}
      </header>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}