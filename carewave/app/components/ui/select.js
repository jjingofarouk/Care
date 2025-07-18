// components/ui/Select.js
'use client';

import React from 'react';

export function Select({ value, onValueChange, children }) {
  return (
    <div className="relative">
      <select
        className="flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent transition-all duration-200 appearance-none"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--hospital-gray-700)]">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

export function SelectTrigger({ children }) {
  return <div>{children}</div>;
}

export function SelectContent({ children }) {
  return children;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

export function SelectValue({ placeholder }) {
  return <option value="" disabled>{placeholder}</option>;
}
