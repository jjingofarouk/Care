// system-admin/page.jsx
import React from 'react';
import SystemAdminList from './SystemAdminList';
import SystemAdminForm from './SystemAdminForm';

const SystemAdminPage = () => {
  return (
    <div>
      <h1>System Admin Management</h1>
      <SystemAdminForm />
      <SystemAdminList />
    </div>
  );
};

export default SystemAdminPage;
