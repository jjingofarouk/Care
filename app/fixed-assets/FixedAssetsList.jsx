"use client";

// fixed-assets/FixedAssetsList.jsx
import React, { useEffect, useState } from 'react';
import styles from './FixedAssetsList.module.css';
import { getFixedAssets } from './fixedAssetsService';
import FixedAssetsCard from './FixedAssetsCard';

const FixedAssetsList = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getFixedAssets();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div className={styles.list}>
      {assets.map((asset) => (
        <FixedAssetsCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
};

export default FixedAssetsList;
