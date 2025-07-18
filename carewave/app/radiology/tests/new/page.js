// app/radiology/tests/new/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRadiologyTest } from '@/services/radiologyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function RadiologyTestNewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRadiologyTest(formData);
      router.push('/radiology/tests');
    } catch (err) {
      setError('Failed to create test');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Create Radiology Test</h1>
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
        <Button type="submit" className="btn-primary">Create Test</Button>
      </form>
    </div>
  );
}
