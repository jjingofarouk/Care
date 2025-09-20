// substore/SubstoreCard.jsx
'use client';
import React from 'react';
import styles from './SubstoreCard.module.css';

const SubstoreCard = ({ item }) => {
  return (
    <div className={styles.card}>
      <h3>{item.name}</h3>
      <p>Item ID: {item.itemId}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Location: {item.location}</p>
      <p>Last Updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
    </div>
  );
};

export default SubstoreCard;
