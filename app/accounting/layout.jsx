import React from 'react';

export default function AccountingLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}