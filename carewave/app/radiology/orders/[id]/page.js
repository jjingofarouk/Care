// app/radiology/orders/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getImagingOrder } from '@/services/radiologyService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
