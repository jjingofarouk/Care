'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

function InventoryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('id');
  const [formData, setFormData] = useState({
    drugId: '',
    batchNumber: '',
    quantity: '',
    unitPrice: '',
    expiryDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrugs();
    if (itemId) {
      fetchInventoryItem();
    }
  }, [itemId]);

  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/pharmacy/inventory?resource=drugs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drugs');
      }

      const drugsData = await response.json();
      setDrugs(drugsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/inventory?id=${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFormData({
        drugId: data.drugId || '',
        batchNumber: data.batchNumber || '',
        quantity: data.quantity || '',
        unitPrice: data.unitPrice || '',
        expiryDate: data.expiryDate ? format(new Date(data.expiryDate), 'yyyy-MM-dd') : '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = itemId ? `/api/pharmacy/inventory` : '/api/pharmacy/inventory';
      const method = itemId ? 'PUT' : 'POST';
      const body = itemId ? { ...formData, id: itemId } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      router.push('/pharmacy/inventory');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          Error: {error}
        </Typography>
        <button
          onClick={() => router.push('/pharmacy/inventory')}
          className="btn btn-primary"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-[1280px] mx-auto p-2 mobile-full-width">
      <Typography className="text-[var(--hospital-gray-900)] mb-3 text-xl font-semibold">
        {itemId ? 'Edit Inventory Item' : 'New Inventory Item'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className="space-y-3">
        <FormControl fullWidth>
          <InputLabel>Drug</InputLabel>
          <Select
            name="drugId"
            value={formData.drugId}
            onChange={handleChange}
            required
            className="select"
          >
            {drugs.map((drug) => (
              <MenuItem key={drug.id} value={drug.id}>
                {drug.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Batch Number"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          required
          className="input"
        />

        <TextField
          fullWidth
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
          className="input"
        />

        <TextField
          fullWidth
          label="Unit Price"
          name="unitPrice"
          type="number"
          value={formData.unitPrice}
          onChange={handleChange}
          required
          className="input"
        />

        <TextField
          fullWidth
          label="Expiry Date"
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          required
          className="input"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : 'Save Item'}
          </button>
          <button
            onClick={() => router.push('/pharmacy/inventory')}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>
      </Box>
    </div>
  );
}

export default function InventoryForm() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="loading-spinner" /></div>}>
      <InventoryFormContent />
    </Suspense>
  );
}