'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import queueService from '@/services/queueService';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('name', {
    header: 'Status Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
];

export default function QueueStatusesPage() {
  const [queueStatuses, setQueueStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    queueService.getQueueStatuses()
      .then(data => {
        setQueueStatuses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRowClick = (row) => {
    router.push(`/queue/statuses/${row.original.id}`);
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Queue Statuses</h1>
        <button
          onClick={() => router.push('/queue/statuses/new')}
          className="bg-hospital-accent text-hospital-white px-4 py-2 rounded-md hover:bg-hospital-accent-dark"
        >
          Add Queue Status
        </button>
      </div>
      <DataTable 
        columns={columns} 
        data={queueStatuses} 
        onRowClick={handleRowClick}
        loading={loading}
        enableRowSelection={false}
        enableColumnManagement={true}
        enableExport={true}
        enableAdvancedFiltering={true}
        enableRowStriping={true}
      />
    </div>
  );
}
