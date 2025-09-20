// app/radiology/results/page.js
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getRadiologyResults, deleteRadiologyResult } from '@/services/radiologyService';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye } from 'lucide-react';

export default function RadiologyResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { results, total } = await getRadiologyResults();
        setResults(results);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const columns = useMemo(() => [
    {
      header: 'Patient',
      accessorFn: (row) => `${row.imagingOrder.patient.firstName} ${row.imagingOrder.patient.lastName}`,
    },
    {
      header: 'Test',
      accessorKey: 'imagingOrder.radiologyTest.name',
    },
    {
      header: 'Result',
      accessorKey: 'result',
    },
    {
      header: 'Resulted At',
      accessorKey: 'resultedAt',
      cell: ({ row }) => new Date(row.original.resultedAt).toLocaleDateString(),
    },
    {
      header: 'Images Count',
      accessorFn: (row) => row.scanImages.length,
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiology/results/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiology/results/${row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await deleteRadiologyResult(row.original.id);
                setResults(results.filter((result) => result.id !== row.original.id));
                setTotal(total - 1);
              } catch (error) {
                console.error('Error deleting result:', error);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [router, results, total]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Radiology Results</h1>
        <Button onClick={() => router.push('/radiology/results/new')}>
          Create Result
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={results}
        loading={loading}
        onRowClick={(row) => router.push(`/radiology/results/${row.id}`)}
      />
    </div>
  );
}
