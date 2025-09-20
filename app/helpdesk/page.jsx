// helpdesk/page.jsx
import React from 'react';
import HelpdeskList from './HelpdeskList';
import HelpdeskForm from './HelpdeskForm';

const HelpdeskPage = () => {
  return (
    <div>
      <h1>Helpdesk Management</h1>
      <HelpdeskForm />
      <HelpdeskList />
    </div>
  );
};

export default HelpdeskPage;
