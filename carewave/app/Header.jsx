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
  
  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  const userMenuItems = user ? [
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: UserIcon,
      description: 'View and edit your profile'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: CogIcon,
      description: 'Application preferences'
    },
    { 
      name: 'Logout', 
      path: '#', 
      onClick: handleLogout, 
      icon: ArrowRightOnRectangleIcon,
      description: 'Sign out of your account',
      danger: true
    },
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
      <header className="fixed w-full bg-gradient-to-r from-hospital-white to-hospital-gray-50 dark:from-hospital-gray-900 dark:to-hospital-gray-800 border-b border-hospital-gray-200 dark:border-hospital-gray-700 shadow-md backdrop-blur-md">
        <div className="flex items-center justify-between h-18 px-6">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-hospital-accent/10 hover:scale-105 transition-all duration-fast" onClick={toggleSidebar}>
            <button className="p-1 text-hospital-gray-500 hover:bg-transparent">
              <Bars3Icon className="w-5 h-5" />
            </button>
            <img src="/logo.png" alt="CareWave Logo" className="w-10 h-10 rounded-lg shadow-sm" />
            <h1 className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              CareWave
            </h1>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Navigation Items (for non-authenticated users) */}
          {!user && (
            <div className="flex gap-2 mr-4">
              {userMenuItems.slice(0, -1).map(({ name, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`rounded-lg px-4 py-2 font-medium transition-all duration-fast hover:bg-hospital-accent/10 hover:-translate-y-0.5 ${pathname === path ? 'bg-hospital-accent/20 text-hospital-accent' : 'text-hospital-gray-900 dark:text-hospital-white'}`}
                >
                  {name}
                </Link>
              ))}
            </div>
          )}

          {/* User Info Section */}
          <div className="flex items-center gap-4">
            {/* User Name and Role */}
            {user && (
              <div className="hidden md:block text-right">
                <span className="font-semibold text-hospital-gray-900 dark:text-hospital-white">
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
                className="text-hospital-gray-500 hover:text-hospital-accent transition-colors duration-fast"
              >
                <div className="relative">
                  <BellIcon className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-hospital-error text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* User Avatar/Menu */}
            <button onClick={handleMenuOpen} className="p-0">
              {user ? (
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm bg-[${roleColors[user.role] || '#64748b'}] hover:scale-105 transition-transform duration-fast`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              ) : (
                <AccountCircle className="text-hospital-gray-500 w-9 h-9" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* User Menu */}
      <div
        className={`absolute top-20 right-4 bg-hospital-white dark:bg-hospital-gray-800 rounded-xl shadow-lg border border-hospital-gray-200 dark:border-hospital-gray-700 min-w-[280px] transition-all duration-fast ${anchorEl ? 'block' : 'hidden'}`}
      >
        {user && (
          <div className="p-4 border-b border-hospital-gray-200 dark:border-hospital-gray-700">
            <div className="font-semibold text-hospital-gray-900 dark:text-hospital-white">
              {user.name || user.email}
            </div>
            <div className="text-sm text-hospital-gray-500">
              {roleDisplayNames[user.role]} Account
            </div>
          </div>
        )}
        
        {userMenuItems.map(({ name, path, onClick, icon: Icon, description, danger }) => (
          <Link
            key={path}
            href={onClick ? '#' : path}
            onClick={onClick || handleMenuClose}
            className={`flex items-center gap-4 p-3 m-2 rounded-lg hover:bg-hospital-accent/10 transition-all duration-fast ${danger ? 'hover:bg-hospital-error/10 hover:text-hospital-error' : ''}`}
          >
            {Icon && <Icon className="w-5 h-5" />}
            <div>
              <div className="font-medium">{name}</div>
              {description && (
                <div className="text-sm text-hospital-gray-500">{description}</div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Notifications Menu */}
      {user && (
        <div
          className={`absolute top-20 right-4 bg-hospital-white dark:bg-hospital-gray-800 rounded-xl shadow-lg border border-hospital-gray-200 dark:border-hospital-gray-700 min-w-[280px] transition-all duration-fast ${notificationAnchor ? 'block' : 'hidden'}`}
        >
          <div className="p-4 border-b border-hospital-gray-200 dark:border-hospital-gray-700">
            <div className="font-semibold">Notifications</div>
          </div>
          
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 m-2 rounded-lg ${notification.unread ? 'bg-hospital-accent/5 border-l-4 border-hospital-accent' : 'border-l-4 border-transparent'}`}
            >
              <div className={`font-${notification.unread ? 'semibold' : 'normal'}`}>
                {notification.title}
              </div>
              <div className="text-sm text-hospital-gray-500">{notification.time}</div>
            </div>
          ))}
          
          <div className="border-t border-hospital-gray-200 dark:border-hospital-gray-700 m-2" />
          <div className="p-3 m-2 rounded-lg hover:bg-hospital-accent/10">
            <div className="font-medium text-hospital-accent">View all notifications</div>
          </div>
        </div>
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}