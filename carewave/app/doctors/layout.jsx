'use client';
import React from 'react';

const DoctorsLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] flex flex-col w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default DoctorsLayout;