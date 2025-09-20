// operation-theatre/page.jsx
import React from 'react';
import OperationTheatreList from './OperationTheatreList';
import OperationTheatreForm from './OperationTheatreForm';

const OperationTheatrePage = () => {
  return (
    <div>
      <h1>Operation Theatre Management</h1>
      <OperationTheatreForm />
      <OperationTheatreList />
    </div>
  );
};

export default OperationTheatrePage;
