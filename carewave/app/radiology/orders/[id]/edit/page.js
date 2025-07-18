// app/radiology/orders/[id]/edit/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getImagingOrder, updateImagingOrder, getRadiologyTests, getPatientInfo } from '@/services/radiologyService';
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

  const Button = ({ children, variant = 'default', size = 'md', disabled = false, onClick, className = '' }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      default: 'bg-white text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)]',
      outline: 'bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)]',
      primary: 'bg-[var(--hospital-accent)] text-white hover:bg-[var(--hospital-accent-dark)] focus:ring-[var(--hospital-accent)]',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
    };
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const Select = ({ value, onValueChange, children }) => (
    <div className="relative">
      <select
        className="flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent transition-all duration-200 appearance-none"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--hospital-gray-700)]">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  const SelectTrigger = ({ children }) => <div>{children}</div>;
  const SelectContent = ({ children }) => children;
  const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
  const SelectValue = ({ placeholder }) => <option value="" disabled>{placeholder}</option>;

  const Input = ({ value, onChange, disabled = false, type = 'text', className = '' }) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-[var(--hospital-gray-300)] bg-white px-3 py-2 text-sm text-[var(--hospital-gray-900)] placeholder:text-[var(--hospital-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--hospital-accent)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );

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