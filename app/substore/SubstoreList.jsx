// substore/SubstoreList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './SubstoreList.module.css';
import { getSubstoreItems } from './substoreService';
import SubstoreCard from './SubstoreCard';

const SubstoreList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getSubstoreItems();
        setItems(data);
      } catch (error) {
        console.error('Error fetching substore items:', error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <SubstoreCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default SubstoreList;
