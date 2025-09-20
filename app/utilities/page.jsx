// utilities/page.jsx
import React from 'react';
import UtilitiesList from './UtilitiesList';
import UtilitiesForm from './UtilitiesForm';

const UtilitiesPage = () => {
  return (
    <div>
      <h1>Utilities Management</h1>
      <UtilitiesForm />
      <UtilitiesList />
    </div>
  );
};

export default UtilitiesPage;
