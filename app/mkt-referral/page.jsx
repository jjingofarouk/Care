// mkt-referral/page.jsx
import React from 'react';
import MktReferralList from './MktReferralList';
import MktReferralForm from './MktReferralForm';

const MktReferralPage = () => {
  return (
    <div>
      <h1>Marketing Referral Management</h1>
      <MktReferralForm />
      <MktReferralList />
    </div>
  );
};

export default MktReferralPage;
