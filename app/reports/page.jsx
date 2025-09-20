// reports/page.jsx
import React from 'react';
import ReportList from './ReportList';
import ReportGenerator from './ReportGenerator';

const ReportsPage = () => {
  return (
    <div>
      <h1>Reports Management</h1>
      <ReportGenerator />
      <ReportList />
    </div>
  );
};

export default ReportsPage;
