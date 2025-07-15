"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (session?.user) {
    router.push('/appointments');
    return null;
  }

  return (
    <div className="min-h-screen bg-hospital-gray-50">
      <main>{children}</main>
    </div>
  );
}