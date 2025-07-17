// app/radiology/orders/[id]/edit/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getImagingOrder, updateImagingOrder, getRadiologyTests, getPatientInfo } from '@/services/radiologyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function ImagingOrderEditPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({ patientId: '', radiologyTestId: '', orderedAt: '' });
  const [tests, setTests] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [order, testData] = await Promise.all([
          getImagingOrder(params.id),
          getRadiologyTests(),
        ]);
        const patientData = await getPatientInfo(order.patientId);
        setFormData({
          patientId: order.patientId,
          radiologyTestId: order.radiologyTestId,
          orderedAt: new Date(order.orderedAt).toISOString().split('T')[0],
        });
        setTests(testData.tests);
        setPatient(patientData);
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateImagingOrder(params.id, formData);
      router.push(`/radiology/orders/${params.id}`);
    } catch (err) {
      setError('Failed to update order');
    }
  };

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Edit Imaging Order</h1>
        <Button variant="outline" onClick={() => router.push('/radiology/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Patient</label>
          <Input value={patient ? `${patient.firstName} ${patient.lastName}` : ''} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Test</label>
          <Select
            value={formData.radiologyTestId}
            onValueChange={(value) => setFormData({ ...formData, radiologyTestId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a test" />
            </SelectTrigger>
            <SelectContent>
              {tests.map((test) => (
                <SelectItem key={test.id} value={test.id}>{test.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Ordered At</label>
          <Input
            type="date"
            value={formData.orderedAt}
            onChange={(e) => setFormData({ ...formData, orderedAt: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="btn-primary">Update Order</Button>
      </form>
    </div>
  );
}
