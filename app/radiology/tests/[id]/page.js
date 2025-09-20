// app/radiology/tests/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRadiologyTest } from '@/services/radiologyService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

export default function RadiologyTestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTest() {
      try {
        const data = await getRadiologyTest(params.id);
        setTest(data);
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTest();
  }, [params.id]);

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  if (!test) {
    return <div>Test not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/radiology/tests')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tests
        </Button>
        <Button onClick={() => router.push(`/radiology/tests/${test.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Test
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{test.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{test.description || 'No description'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Related Orders</h3>
              <ul className="list-disc pl-5">
                {test.imagingOrders.map((order) => (
                  <li key={order.id}>
                    Order for {order.patient.firstName} {order.patient.lastName} on{' '}
                    {new Date(order.orderedAt).toLocaleDateString()}
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
