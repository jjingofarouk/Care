// procurement/page.jsx
import React from 'react';
import ProcurementList from './ProcurementList';
import ProcurementForm from './ProcurementForm';

const ProcurementPage = () => {
  return (
    <div>
      <h1>Procurement Management</h1>
      <ProcurementForm />
      <ProcurementList />
    </div>
  );
};

export default ProcurementPage;
