// app/radiology/orders/page.js
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getImagingOrders, deleteImagingOrder } from '@/services/radiologyService';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye } from 'lucide-react';

export default function ImagingOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { orders, total } = await getImagingOrders();
        setOrders(orders);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const columns = useMemo(() => [
    {
      header: 'Patient',
      accessorFn: (row) => `${row.patient.firstName} ${row.patient.lastName}`,
    },
    {
      header: 'Test',
      accessorKey: 'radiologyTest.name',
    },
    {
      header: 'Ordered At',
      accessorKey: 'orderedAt',
      cell: ({ row }) => new Date(row.original.orderedAt).toLocaleDateString(),
    },
    {
      header: 'Results Count',
      accessorFn: (row) => row.radiologyResults.length,
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiology/orders/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/radiology/orders/${row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await deleteImagingOrder(row.original.id);
                setOrders(orders.filter((order) => order.id !== row.original.id));
                setTotal(total - 1);
              } catch (error) {
                console.error('Error deleting order:', error);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [router, orders, total]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Imaging Orders</h1>
        <Button onClick={() => router.push('/radiology/orders/new')}>
          Create Order
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        onRowClick={(row) => router.push(`/radiology/orders/${row.id}`)}
      />
    </div>
  );
}
