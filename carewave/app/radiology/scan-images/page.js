// app/radiology/scan-images/page.js
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getScanImages, deleteScanImage } from '@/services/radiologyService';
import DataTable from '@/components/DataTable';
import { Button } from '@mui/material';
import { Trash2, Edit, Eye } from 'lucide-react';

export default function ScanImagesPage() {
  const router = useRouter();
  const [scanImages, setScanImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScanImages() {
      try {
        const { scanImages, total } = await getScanImages();
        setScanImages(scanImages);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching scan images:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchScanImages();
  }, []);

  const columns = useMemo(() => [
    {
      header: 'Patient',
      accessorFn: (row) => `${row.radiologyResult.imagingOrder.patient.firstName} ${row.radiologyResult.imagingOrder.patient.lastName}`,
    },
    {
      header: 'Image URL',
      accessorKey: 'imageUrl',
      cell: ({ row }) => (
        <a href={row.original.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--hospital-accent)] hover:underline">
          View Image
        </a>
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)] px-3 py-1.5 text-sm"
            onClick={() => router.push(`/radiology/scan-images/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)] px-3 py-1.5 text-sm"
            onClick={() => router.push(`/radiology/scan-images/${row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-[var(--hospital-gray-700)] border border-[var(--hospital-gray-300)] hover:bg-[var(--hospital-gray-50)] focus:ring-[var(--hospital-accent)] px-3 py-1.5 text-sm"
            onClick={async () => {
              try {
                await deleteScanImage(row.original.id);
                setScanImages(scanImages.filter((image) => image.id !== row.original.id));
                setTotal(total - 1);
              } catch (error) {
                console.error('Error deleting scan image:', error);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [router, scanImages, total]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Scan Images</h1>
        <Button
          variant="contained"
          className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--hospital-accent)] text-white hover:bg-[var
