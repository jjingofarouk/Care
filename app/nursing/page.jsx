// nursing/page.jsx
import React from 'react';
import NursingList from './NursingList';
import NursingForm from './NursingForm';

const NursingPage = () => {
  return (
    <div>
      <h1>Nursing Management</h1>
      <NursingForm />
      <NursingList />
    </div>
  );
};

export default NursingPage;
