// app/radiology/tests/page.js
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getRadiologyTests, deleteRadiologyTest } from '@/services/radiologyService';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye } from 'lucide-react';

export default function RadiologyTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const { tests, total } = await getRadiologyTests();
        setTests(tests);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Orders Count',
      accessorFn: (row) => row.imagingOrders.length,
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiology/tests/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiology/tests/${row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await deleteRadiologyTest(row.original.id);
                setTests(tests.filter((test) => test.id !== row.original.id));
                setTotal(total - 1);
              } catch (error) {
                console.error('Error deleting test:', error);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [router, tests, total]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Radiology Tests</h1>
        <Button onClick={() => router.push('/radiology/tests/new')}>
          Create Test
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={tests}
        loading={loading}
        onRowClick={(row) => router.push(`/radiology/tests/${row.id}`)}
      />
    </div>
  );
}
