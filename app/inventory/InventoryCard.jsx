// inventory/InventoryCard.jsx
import React from 'react';
import styles from './InventoryCard.module.css';

const InventoryCard = ({ item }) => {
  return (
    <div className={styles.card}>
      <h3>{item.name}</h3>
      <p>Item ID: {item.itemId}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Category: {item.category}</p>
      <p>Last Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
    </div>
  );
};

export default InventoryCard;
