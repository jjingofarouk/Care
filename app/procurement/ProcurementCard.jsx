// procurement/ProcurementCard.jsx
'use client';
import React from 'react';
import styles from './ProcurementCard.module.css';

const ProcurementCard = ({ procurement }) => {
  return (
    <div className={styles.card}>
      <h3>{procurement.itemName}</h3>
      <p>Procurement ID: {procurement.procurementId}</p>
      <p>Quantity: {procurement.quantity}</p>
      <p>Supplier: {procurement.supplier}</p>
      <p>Date: {new Date(procurement.date).toLocaleDateString()}</p>
    </div>
  );
};

export default ProcurementCard;
