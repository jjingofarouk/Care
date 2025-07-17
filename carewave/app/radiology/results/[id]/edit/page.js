// app/radiology/results/[id]/edit/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRadiologyResult, updateRadiologyResult, getImagingOrder } from '@/services/radiologyService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

export default function RadiologyResultEditPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({ imagingOrderId: '', result: '', resultedAt: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getRadiologyResult(params.id);
        const orderData = await getImagingOrder(result.imagingOrderId);
        setFormData({
          imagingOrderId: result.imagingOrderId,
          result: result.result,
          resultedAt: new Date(result.resultedAt).toISOString().split('T')[0],
        });
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load result');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRadiologyResult(params.id, formData);
      router.push(`/radiology/results/${params.id}`);
    } catch (err) {
      setError('Failed to update result');
    }
  };

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Edit Radiology Result</h1>
        <Button variant="outline" onClick={() => router.push('/radiology/results')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Order</label>
          <Input
            value={order ? `${order.patient.firstName} ${order.patient.lastName} - ${order.radiologyTest.name}` : ''}
            disabled
          />
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
          />
        </div>
        <Button type="submit" className="btn-primary">Update Result</Button>
      </form>
    </div>
  );
}
