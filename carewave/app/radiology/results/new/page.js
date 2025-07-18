// app/radiology/results/new/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRadiologyResult, getImagingOrders } from '@/services/radiologyService';
import { ArrowLeft } from 'lucide-react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function RadiologyResultNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ imagingOrderId: '', result: '', resultedAt: '' });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { orders } = await getImagingOrders();
        setOrders(orders);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRadiologyResult(formData);
      router.push('/radiology/results');
    } catch (err) {
      setError('Failed to create result');
    }
  };

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Create Radiology Result</h1>
        <Button
          variant="outlined"
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)] px-4 py-2 text-sm"
          onClick={() => router.push('/radiology/results')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <FormControl fullWidth>
            <InputLabel className="block text-sm font-medium text-[var(--hospital-gray-700)]">Order</InputLabel>
            <Select
              value={formData.imagingOrderId}
              onChange={(e) => setFormData({ ...formData, imagingOrderId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent transition-all duration-200"
            >
              <MenuItem value="" disabled>Select an order</MenuItem>
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  {order.patient.firstName} {order.patient.lastName} - {order.radiologyTest.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <InputLabel className="block text-sm font-medium text-[var(--hospital-gray-700)]">Result</InputLabel>
          <TextField
            multiline
            rows={4}
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            required
            fullWidth
            className="flex min-h-[80px] w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] placeholder:text-[var(--hospital-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          />
        </div>
        <div>
          <InputLabel className="block text-sm font-medium text-[var(--hospital-gray-700)]">Resulted At</InputLabel>
          <TextField
            type="date"
            value={formData.resultedAt}
            onChange={(e) => setFormData({ ...formData, resultedAt: e.target.value })}
            required
            fullWidth
            className="flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] placeholder:text-[var(--hospital-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <Button
          type="submit"
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--hospital-accent)] text-white hover:bg-[var(--hospital-accent-dark)] focus:ring-[var(--hospital-accent)] px-4 py-2 text-sm btn-primary"
        >
          Create Result
        </Button>
      </form>
    </div>
  );
}