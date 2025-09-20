// nhif/page.jsx
import React from 'react';
import NhifList from './NhifList';
import NhifForm from './NhifForm';

const NhifPage = () => {
  return (
    <div>
      <h1>NHIF Claims Management</h1>
      <NhifForm />
      <NhifList />
    </div>
  );
};

export default NhifPage;
