// app/radiology/scan-images/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getScanImage } from '@/services/radiologyService';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@mui/material';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ScanImageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [scanImage, setScanImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScanImage() {
      try {
        const data = await getScanImage(params.id);
        setScanImage(data);
      } catch (error) {
        console.error('Error fetching scan image:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchScanImage();
  }, [params.id]);

  if (loading) {
    return <div className="skeleton h-64 w-full" />;
  }

  if (!scanImage) {
    return <div>Scan image not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outlined"
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)] px-4 py-2 text-sm"
          onClick={() => router.push('/radiology/scan-images')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scan Images
        </Button>
        <Button
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--hospital-accent)] text-white hover:bg-[var(--hospital-accent-dark)] focus:ring-[var(--hospital-accent)] px-4 py-2 text-sm"
          onClick={() => router.push(`/radiology/scan-images/${scanImage.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Scan Image
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scan Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Patient</h3>
              <p>{scanImage.radiologyResult.imagingOrder.patient.firstName} {scanImage.radiologyResult.imagingOrder.patient.lastName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Image</h3>
              <img
                src={scanImage.imageUrl}
                alt="Scan image"
                className="w-full max-w-md h-auto object-cover rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
