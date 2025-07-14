'use client';
import React, { useState, useEffect } from 'react';
import pharmacyService from '@/services/pharmacyService';
import InventoryTable from '@/components/pharmacy/InventoryTable';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await pharmacyService.getAvailablePharmacyItems();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="w-full p-2">
      <InventoryTable inventory={inventory} />
    </div>
  );
}