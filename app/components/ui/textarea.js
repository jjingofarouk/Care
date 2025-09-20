// components/ui/Textarea.js
'use client';

import React from 'react';

export function Textarea({ value, onChange, disabled = false, className = '' }) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] placeholder:text-[var(--hospital-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
