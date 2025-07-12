import React from 'react';

export default function AppointmentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow">{children}</main>
    </div>
  );
}