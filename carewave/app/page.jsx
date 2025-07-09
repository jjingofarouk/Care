import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardOverview from './dashboard/DashboardOverview';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main>
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
}