// components/ui/Card.js
'use client';

import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-[var(--hospital-gray-200)] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div className="px-6 py-4 border-b border-[var(--hospital-gray-200)]">
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return (
    <h2 className="text-xl font-semibold text-[var(--hospital-gray-900)]">
      {children}
    </h2>
  );
}

export function CardContent({ children }) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}
