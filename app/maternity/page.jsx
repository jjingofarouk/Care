// maternity/page.jsx
import React from 'react';
import MaternityList from './MaternityList';
import MaternityForm from './MaternityForm';

const MaternityPage = () => {
  return (
    <div>
      <h1>Maternity Management</h1>
      <MaternityForm />
      <MaternityList />
    </div>
  );
};

export default MaternityPage;
