"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from './authUtils';

export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isAuthenticated(token)) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="mt-16 p-0">
      <main>{children}</main>
    </div>
  );
}