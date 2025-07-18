// app/radiology/orders/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getImagingOrder } from '@/services/radiologyService';
import { ArrowLeft, Edit } from 'lucide-react';

export default function ImagingOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getImagingOrder(params.id);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

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

  const Card = ({ children, className = '' }) => (
    <div className={`rounded-lg border border-[var(--hospital-gray-200)] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-[var(--hospital-gray-200)]">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-[var(--hospital-gray-900)]">
      {children}
    </h2>
  );

  const CardContent = ({ children }) => (
    <div className="p-6">
      {children}
    </div>
  );

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/radiology/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <Button onClick={() => router.push(`/radiology/orders/${order.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Order
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Imaging Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Patient</h3>
              <p>{order.patient.firstName} {order.patient.lastName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Test</h3>
              <p>{order.radiologyTest.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Ordered At</h3>
              <p>{new Date(order.orderedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Results</h3>
              <ul className="list-disc pl-5">
                {order.radiologyResults.map((result) => (
                  <li key={result.id}>
                    Result on {new Date(result.resultedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}