// fixed-assets/FixedAssetsCard.jsx
import React from 'react';
import styles from './FixedAssetsCard.module.css';

const FixedAssetsCard = ({ asset }) => {
  return (
    <div className={styles.card}>
      <h3>{asset.name}</h3>
      <p>Asset ID: {asset.assetId}</p>
      <p>Type: {asset.type}</p>
      <p>Purchase Date: {new Date(asset.purchaseDate).toLocaleDateString()}</p>
      <p>Status: {asset.status}</p>
    </div>
  );
};

export default FixedAssetsCard;