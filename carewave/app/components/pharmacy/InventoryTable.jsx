'use client';
import React from 'react';
import { format } from 'date-fns';

export default function InventoryTable({ inventory }) {
  return (
    <div className="card w-full p-4">
      <div className="card-header">
        <h2 className="card-title">Pharmacy Inventory</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Drug</th>
            <th>Batch Number</th>
            <th>Expiry Date</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.drug.name}</td>
              <td>{item.batchNumber}</td>
              <td>{format(new Date(item.expiryDate), 'PP')}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}