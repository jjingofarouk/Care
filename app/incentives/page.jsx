// incentive/page.jsx
import React from 'react';
import IncentiveList from './IncentiveList';
import IncentiveForm from './IncentiveForm';

const IncentivePage = () => {
  return (
    <div>
      <h1>Incentive Management</h1>
      <IncentiveForm />
      <IncentiveList />
    </div>
  );
};

export default IncentivePage;
