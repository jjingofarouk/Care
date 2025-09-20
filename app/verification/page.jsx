// verification/page.jsx
import React from 'react';
import VerificationList from './VerificationList';
import VerificationForm from './VerificationForm';

const VerificationPage = () => {
  return (
    <div>
      <h1>Verification Management</h1>
      <VerificationForm />
      <VerificationList />
    </div>
  );
};

export default VerificationPage;
