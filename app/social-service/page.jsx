// social-service/page.jsx
import React from 'react';
import SocialServiceList from './SocialServiceList';
import SocialServiceForm from './SocialServiceForm';

const SocialServicePage = () => {
  return (
    <div>
      <h1>Social Service Management</h1>
      <SocialServiceForm />
      <SocialServiceList />
    </div>
  );
};

export default SocialServicePage;
