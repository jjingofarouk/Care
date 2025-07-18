// app/radiology/results/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRadiologyResult } from '@/services/radiologyService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

export default function RadiologyResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const data = await getRadiologyResult(params.id);
        setResult(data);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [params.id]);

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  if (!result) {
    return <div>Result not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/radiology/results')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
        <Button onClick={() => router.push(`/radiology/results/${result.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Result
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Radiology Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Patient</h3>
              <p>{result.imagingOrder.patient.firstName} {result.imagingOrder.patient.lastName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Test</h3>
              <p>{result.imagingOrder.radiologyTest.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Result</h3>
              <p>{result.result}</p>
            </div>
            <div>
              <h3 className="font-semibold">Resulted At</h3>
              <p>{new Date(result.resultedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Scan Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {result.scanImages.map((image) => (
                  <img
                    key={image.id}
                    src={image.imageUrl}
                    alt="Scan image"
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
