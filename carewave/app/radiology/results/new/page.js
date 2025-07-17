// app/radiology/results/new/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRadiologyResult, getImagingOrders } from '@/services/radiologyService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

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
        <h1 className="text-2xl font-bold text-hospital-gray-900">Create Radiology Result</h1>
        <Button variant="outline" onClick={() => router.push('/radiology/results')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Order</label>
          <Select
            value={formData.imagingOrderId}
            onValueChange={(value) => setFormData({ ...formData, imagingOrderId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.patient.firstName} {order.patient.lastName} - {order.radiologyTest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Result</label>
          <Textarea
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Resulted At</label>
          <Input
            type="date"
            value={formData.resultedAt}
            onChange={(e) => setFormData({ ...formData, resultedAt: e.target.value })}
            required
