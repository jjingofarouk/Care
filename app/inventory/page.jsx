// inventory/page.jsx
import React from 'react';
import InventoryList from './InventoryList';
import InventoryForm from './InventoryForm';

const InventoryPage = () => {
  return (
    <div>
      <h1>Inventory Management</h1>
      <InventoryForm />
      <InventoryList />
    </div>
  );
};

export default InventoryPage;
