// app/radiology/orders/new/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createImagingOrder, getRadiologyTests, validatePatientId } from '@/services/radiologyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export default function ImagingOrderNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ patientId: '', radiologyTestId: '', orderedAt: '' });
  const [tests, setTests] = useState([]);
  const [patientError, setPatientError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const { tests } = await getRadiologyTests();
        setTests(tests);
      } catch (err) {
        setError('Failed to load tests');
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  const handlePatientIdChange = async (e) => {
    const patientId = e.target.value;
    setFormData({ ...formData, patientId });
    if (patientId) {
      const isValid = await validatePatientId(patientId);
      setPatientError(isValid ? '' : 'Invalid patient ID');
    } else {
      setPatientError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (patientError) return;
    try {
      await createImagingOrder(formData);
      router.push('/radiology/orders');
    } catch (err) {
      setError('Failed to create order');
    }
  };

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Create Imaging Order</h1>
        <Button variant="outline" onClick={() => router.push('/radiology/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Patient ID</label>
          <Input
            value={formData.patientId}
            onChange={handlePatientIdChange}
            required
          />
          {patientError && <div className="text-hospital-error text-sm">{patientError}</div>}
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
        <Button type="submit" className="btn-primary" disabled={!!patientError}>
          Create Order
        </Button>
      </form>
    </div>
  );
}
