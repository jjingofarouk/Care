"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, BellIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import { AccountCircle } from '@mui/icons-material';
import Sidebar from './Sidebar';
import useAuth from './useAuth';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
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

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-gradient-to-r from-hospital-white to-hospital-gray-50 dark:from-hospital-gray-900 dark:to-hospital-gray-800 border-b border-hospital-gray-200 dark:border-hospital-gray-700 shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-4 sm:h-20 sm:px-6 lg:h-24">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-hospital-accent/10 transition-all duration-200 sm:gap-3">
            <button
              className="p-1 text-hospital-gray-500 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-hospital-accent"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-6 h-6 sm:w-7 h-7" />
            </button>
            <img
              src="/logo.png"
              alt="CareWave Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-sm object-contain"
              loading="lazy"
              width={40}
              height={40}
            />
            <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent sm:text-2xl">
              CareWave
            </h1>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Navigation Items (for non-authenticated users) */}
          {!user && (
            <div className="hidden md:flex gap-2 mr-4">
              {userMenuItems.slice(0, -1).map(({ name, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`rounded-lg px-3 py-2 font-medium transition-all duration-200 hover:bg-hospital-accent/10 hover:-translate-y-0.5 text-sm lg:text-base ${pathname === path ? 'bg-hospital-accent/20 text-hospital-accent' : 'text-hospital-gray-900 dark:text-hospital-white'}`}
                >
                  {name}
                </Link>
              ))}
            </div>
          )}

          {/* User Info Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Name and Role */}
            {user && (
              <div className="hidden lg:block text-right">
                <span className="font-semibold text-hospital-gray-900 dark:text-hospital-white text-sm">
                  {user.name || user.email}
                </span>
                <div className="text-xs font-semibold text-[${roleColors[user.role] || '#64748b'}] bg-[${roleColors[user.role] || '#64748b'}]/10 rounded px-2 py-1 mt-1">
                  {roleDisplayNames[user.role] || 'User'}
                </div>
              </div>
            )}

            {/* Notifications */}
            {user && (
              <button
                onClick={handleNotificationOpen}
                className="relative text-hospital-gray-500 hover:text-hospital-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-hospital-accent"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <BellIcon className="w-6 h-6 sm:w-7 h-7" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hospital-error text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Avatar/Menu */}
            <button
              onClick={handleMenuOpen}
              className="p-0 focus:outline-none focus:ring-2 focus:ring-hospital-accent"
              aria-label="User menu"
            >
              {user ? (
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm bg-[${roleColors[user.role] || '#64748b'}] hover:scale-105 transition-transform duration-200`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              ) : (
                <AccountCircle className="text-hospital-gray-500 w-8 h-8 sm:w-9 sm:h-9" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* User Menu Dropdown */}
      <div
        className={`fixed top-16 sm:top-20 lg:top-24 right-4 bg-hospital-white dark:bg-hospital-gray-800 rounded-xl shadow-lg border border-hospital-gray-200 dark:border-hospital-gray-700 w-64 sm:w-72 max-h-[calc(100vh-6rem)] overflow-y-auto transition-all duration-200 ${anchorEl ? 'block' : 'hidden'}`}
      >
        {user && (
          <div className="p-4 border-b border-hospital-gray-200 dark:border-hospital-gray-700">
            <div className="font-semibold text-hospital-gray-900 dark$text-hospital-white text-sm">
              {user.name || user.email}
            </div>
            <div className="text-xs text-hospital-gray-500">
              {roleDisplayNames[user.role]} Account
            </div>
          </div>
        )}
        {userMenuItems.map(({ name, path, onClick, icon: Icon, description, danger }) => (
          <Link
            key={path}
            href={onClick ? '#' : path}
            onClick={onClick || handleMenuClose}
            className={`flex items-center gap-3 p-3 m-2 rounded-lg hover:bg-hospital-accent/10 transition-all duration-200 text-sm ${danger ? 'hover:bg-hospital-error/10 hover:text-hospital-error' : ''}`}
          >
            {Icon && <Icon className="w-5 h-5" />}
            <div>
              <div className="font-medium">{name}</div>
              {description && (
                <div className="text-xs text-hospital-gray-500">{description}</div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Notifications Dropdown */}
      {user && (
        <div
          className={`fixed top-16 sm:top-20 lg:top-24 right-4 bg-hospital-white dark:bg-hospital-gray-800 rounded-xl shadow-lg border border-hospital-gray-200 dark:border-hospital-gray-700 w-64 sm:w-72 max-h-[calc(100vh-6rem)] overflow-y-auto transition-all duration-200 ${notificationAnchor ? 'block' : 'hidden'}`}
        >
          <div className="p-4 border-b border-hospital-gray-200 dark:border-hospital-gray-700">
            <div className="font-semibold text-sm">Notifications</div>
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 m-2 rounded-lg text-sm ${notification.unread ? 'bg-hospital-accent/5 border-l-4 border-hospital-accent' : 'border-l-4 border-transparent'}`}
            >
              <div className={`font-${notification.unread ? 'semibold' : 'normal'}`}>
                {notification.title}
              </div>
              <div className="text-xs text-hospital-gray-500">{notification.time}</div>
            </div>
          ))}
          <div className="border-t border-hospital-gray-200 dark:border-hospital-gray-700 m-2" />
          <div className="p-3 m-2 rounded-lg hover:bg-hospital-accent/10">
            <div className="font-medium text-hospital-accent text-sm">View all notifications</div>
          </div>
        </div>
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}