"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from './authUtils';

export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isAuthenticated(token)) {
      router.push('/appointment');
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}