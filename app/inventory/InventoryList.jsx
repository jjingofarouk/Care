
"use client";
// inventory/InventoryList.jsx
import React, { useEffect, useState } from 'react';
import styles from './InventoryList.module.css';
import { getInventoryItems } from './inventoryService';
import InventoryCard from './InventoryCard';

const InventoryList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getInventoryItems();
        setItems(data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default InventoryList;
