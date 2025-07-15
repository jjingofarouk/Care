'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';

export default function InventoryDetail() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventoryItem();
  }, []);

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/inventory?id=${params.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItem(data);
    } catch (err) {
      console.error('Error fetching inventory item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <div className="loading-spinner" />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="card max-w-[1280px] mx-auto p-2 mobile-full-width">
        <Typography className="text-[var(--hospital-error)] mb-2">
          Error loading inventory item: {error}
        </Typography>
        <button
          onClick={fetchInventoryItem}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="card max-w-[1280px] mx-auto p-2 mobile-full-width">
        <Typography className="text-[var(--hospital-gray-900)] mb-2">
          Inventory item not found
        </Typography>
        <button
          onClick={() => router.push('/pharmacy/inventory')}
          className="btn btn-outline"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-[1280px] mx-auto p-2 mobile-full-width">
      <Typography variant="h4" className="text-[var(--hospital-gray-900)] mb-4">
        Inventory Item Details
      </Typography>

      <div className="space-y-3">
        <div>
          <Typography className="text-[var(--hospital-gray-500)] text-sm font-medium">
            Item Name
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {item.name || 'N/A'}
          </Typography>
        </div>

        <div>
          <Typography className="text-[var(--hospital-gray-500)] text-sm font-medium">
            Drug
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {item.drug?.name || 'N/A'}
          </Typography>
        </div>

        <div>
          <Typography className="text-[var(--hospital-gray-500)] text-sm font-medium">
            Quantity
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {item.quantity || 'N/A'}
          </Typography>
        </div>

        <div>
          <Typography className="text-[var(--hospital-gray-500)] text-sm font-medium">
            Unit Price
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}
          </Typography>
        </div>

        <div>
          <Typography className="text-[var(--hospital-gray-500)] text-sm font-medium">
            Expiry Date
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {item.expiryDate ? format(new Date(item.expiryDate), 'PP') : 'N/A'}
          </Typography>
        </div>

        <div>
          <Typography className="text-[var(--hospital-gray-500)] text-sm font-medium">
            Last Updated
          </Typography>
          <Typography className="text-[var(--hospital-gray-900)]">
            {item.updatedAt ? format(new Date(item.updatedAt), 'PPp') : 'N/A'}
          </Typography>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => router.push(`/pharmacy/inventory/new?id=${item.id}`)}
          className="btn btn-primary"
        >
          Edit Item
        </button>
        <button
          onClick={() => router.push('/pharmacy/inventory')}
          className="btn btn-outline"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}
