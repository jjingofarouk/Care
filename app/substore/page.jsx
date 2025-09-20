// substore/page.jsx
import React from 'react';
import SubstoreList from './SubstoreList';
import SubstoreForm from './SubstoreForm';

const SubstorePage = () => {
  return (
    <div>
      <h1>Substore Management</h1>
      <SubstoreForm />
      <SubstoreList />
    </div>
  );
};

export default SubstorePage;
