// app/radiology/tests/[id]/edit/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRadiologyTest, updateRadiologyTest } from '@/services/radiologyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function RadiologyTestEditPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTest() {
      try {
        const test = await getRadiologyTest(params.id);
        setFormData({ name: test.name, description: test.description || '' });
      } catch (err) {
        setError('Failed to load test');
      } finally {
        setLoading(false);
      }
    }
    fetchTest();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRadiologyTest(params.id, formData);
      router.push(`/radiology/tests/${params.id}`);
    } catch (err) {
      setError('Failed to update test');
    }
  };

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Edit Radiology Test</h1>
        <Button variant="outline" onClick={() => router.push('/radiology/tests')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tests
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="alert alert-error">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-hospital-gray-700">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <Button type="submit" className="btn-primary">Update Test</Button>
      </form>
    </div>
  );
}
