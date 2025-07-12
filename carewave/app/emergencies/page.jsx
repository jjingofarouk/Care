// emergency/page.jsx
import React from 'react';
import EmergencyList from './EmergencyList';
import EmergencyForm from './EmergencyForm';

const EmergencyPage = () => {
  return (
    <div>
      <h1>Emergency Management</h1>
      <EmergencyForm />
      <EmergencyList />
    </div>
  );
};

export default EmergencyPage;
