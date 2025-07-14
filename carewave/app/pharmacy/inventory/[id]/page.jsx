'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import pharmacyService from '../../../services/pharmacyService';

export default function InventoryItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    batchNumber: '',
    expiryDate: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await pharmacyService.getAvailablePharmacyItems(id);
        const inventoryItem = data.find(i => i.id === id);
        setItem(inventoryItem);
        setFormData({
          batchNumber: inventoryItem.batchNumber,
          expiryDate: new Date(inventoryItem.expiryDate).toISOString().slice(0, 10),
          quantity: inventoryItem.quantity.toString(),
        });
      } catch (error) {
        console.error('Error fetching inventory item:', error);
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pharmacyService.updateDrugInventory(id, formData);
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  return (
    <div className="w-full p-2">
      {item ? (
        <form onSubmit={handleSubmit} className="card w-full p-4">
          <div className="card-header">
            <h2 className="card-title">Edit Inventory Item: {item.drug.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="input"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              placeholder="Batch Number"
              required
            />
            <input
              type="date"
              className="input"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
            <input
              type="number"
              className="input"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Quantity"
              required
              min="0"
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Update Inventory
          </button>
        </form>
      ) : (
        <div className="card w-full p-4">
          <div className="skeleton-text" />
          <div className="skeleton-text" />
        </div>
      )}
    </div>
  );
}