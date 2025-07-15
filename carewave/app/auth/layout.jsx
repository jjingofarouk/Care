"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/useAuth';

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (user) {
    router.push('/appointments');
    return null;
  }

  return (
    <div className="min-h-screen bg-hospital-gray-50">
      <main>{children}</main>
    </div>
  );
}