"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Home,
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import Sidebar from './Sidebar';

const roleColors = {
  PATIENT: '#059669',
  DOCTOR: '#7c3aed',
  NURSE: '#dc2626',
  LAB_TECHNICIAN: '#ea580c',
  STAFF: '#0891b2',
  ADMIN: '#64748b',
  GUEST: '#374151',
  RECEPTIONIST: '#10b981',
  RADIOLOGIST: '#f97316',
  SURGEON: '#8b5cf6',
  ACCOUNTANT: '#6b7280',
  BILLING_OFFICER: '#ef4444',
  HOSPITAL_MANAGER: '#3b82f6',
  IT_SUPPORT: '#d97706',
  CLEANING_STAFF: '#6d28d9',
  SECURITY: '#475569'
};

const roleDisplayNames = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  LAB_TECHNICIAN: 'Lab Tech',
  STAFF: 'Staff',
  ADMIN: 'Administrator',
  GUEST: 'Guest',
  RECEPTIONIST: 'Receptionist',
  RADIOLOGIST: 'Radiologist',
  SURGEON: 'Surgeon',
  ACCOUNTANT: 'Accountant',
  BILLING_OFFICER: 'Billing Officer',
  HOSPITAL_MANAGER: 'Hospital Manager',
  IT_SUPPORT: 'IT Support',
  CLEANING_STAFF: 'Cleaning Staff',
  SECURITY: 'Security'
};

export default function Header() {
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
    setSidebarOpen(false);
  };

  const userMenuItems = user ? [
    { name: 'Profile', path: '/profile', icon: User, description: 'View and edit your profile' },
    { name: 'Settings', path: '/settings', icon: Settings, description: 'Application preferences' },
    { name: 'Logout', path: '#', onClick: handleLogout, icon: LogOut, description: 'Sign out of your account', danger: true },
  ] : [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Login', path: '/auth', icon: User },
    { name: 'Register', path: '/auth', icon: User },
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
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--hospital-white)] border-b border-[var(--hospital-gray-200)] shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:h-20 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 text-[var(--hospital-gray-700)] hover:bg-[var(--hospital-gray-200)] rounded-lg transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/logo.png"
                  alt="CareWave Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-[var(--hospital-gray-900)]">CareWave</span>
                <p className="text-xs text-[var(--hospital-gray-500)] -mt-1">Hospital Management</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="relative">
                <button
                  onClick={toggleNotification}
                  className="relative p-2 text-[var(--hospital-gray-700)] hover:text-[var(--hospital-accent)] hover:bg-[var(--hospital-gray-200)] rounded-lg transition-colors duration-200"
                  aria-label={`Notifications (${unreadCount} unread)`}
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--hospital-error)] text-[var(--hospital-white)] text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationOpen && (
                  <div className="absolute top-12 right-0 bg-[var(--hospital-white)] rounded-xl shadow-lg border border-[var(--hospital-gray-200)] w-80 max-h-[calc(100vh-5rem)] overflow-y-auto z-[1000]">
                    <div className="p-4 border-b border-[var(--hospital-gray-200)] bg-gradient-to-r from-[var(--hospital-accent)]/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[var(--hospital-gray-900)]">Notifications</p>
                        {unreadCount > 0 && (
                          <span className="bg-[var(--hospital-accent)] text-[var(--hospital-white)] text-xs px-2 py-1 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-l-4 cursor-pointer transition-colors duration-200 ${
                            notification.unread 
                              ? 'border-[var(--hospital-accent)] bg-[var(--hospital-accent)]/5 hover:bg-[var(--hospital-accent)]/10' 
                              : 'border-transparent hover:bg-[var(--hospital-gray-200)]/50'
                          }`}
                          onClick={() => setNotificationOpen(false)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm ${notification.unread ? 'font-semibold' : 'font-normal'} text-[var(--hospital-gray-900)]`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-[var(--hospital-gray-500)] mt-1">{notification.time}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-[var(--hospital-accent)] rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-[var(--hospital-gray-200)] bg-[var(--hospital-gray-50)]">
                      <p className="text-sm text-[var(--hospital-accent)] font-medium cursor-pointer hover:underline text-center">
                        View all notifications
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--hospital-gray-200)] transition-colors duration-200"
                aria-label="User menu"
              >
                {user ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--hospital-white)] font-semibold shadow-sm"
                      style={{ backgroundColor: roleColors[user.role] || '#64748b' }}
                    >
                      {user.firstName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-[var(--hospital-gray-900)]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[var(--hospital-gray-500)]">
                        {roleDisplayNames[user.role]}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-8 h-8 text-[var(--hospital-gray-700)]" />
                    <ChevronDown className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                  </div>
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute top-12 right-0 bg-[var(--hospital-white)] rounded-xl shadow-lg border border-[var(--hospital-gray-200)] w-72 max-h-[calc(100vh-5rem)] overflow-y-auto z-[1000]">
                  {user && (
                    <div className="p-4 border-b border-[var(--hospital-gray-200)] bg-gradient-to-r from-[var(--hospital-accent)]/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-[var(--hospital-white)] font-bold text-lg shadow-sm"
                          style={{ backgroundColor: roleColors[user.role] || '#64748b' }}
                        >
                          {user.firstName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--hospital-gray-900)]">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-[var(--hospital-gray-500)]">
                            {roleDisplayNames[user.role]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="py-2">
                    {userMenuItems.map(({ name, path, onClick, icon: Icon, description, danger }) => (
                      <Link
                        key={path}
                        href={onClick ? '#' : path}
                        onClick={onClick || (() => setUserMenuOpen(false))}
                        className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors duration-200 ${
                          danger 
                            ? 'hover:bg-[var(--hospital-error)]/10 hover:text-[var(--hospital-error)]' 
                            : 'hover:bg-[var(--hospital-accent)]/10 text-[var(--hospital-gray-900)]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{name}</p>
                          {description && <p className="text-xs text-[var(--hospital-gray-500)]">{description}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}