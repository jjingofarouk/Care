'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import queueService from '@/services/queueService';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('queueNumber', {
    header: 'Queue Number',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('patient.name', {
    header: 'Patient',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('serviceCounter.name', {
    header: 'Service Counter',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('queueStatus.name', {
    header: 'Status',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
];

export default function QueuePage() {
  const [queueEntries, setQueueEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    queueService.getAll().then(setQueueEntries);
  }, []);

  const handleRowClick = (row) => {
    router.push(`/queue/${row.original.id}`);
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-hospital-gray-900">Queue Management</h1>
        <button
          onClick={() => router.push('/queue/new')}
          className="bg-hospital-accent text-hospital-white px-4 py-2 rounded-md hover:bg-hospital-accent-dark"
        >
          Add Queue Entry
        </button>
      </div>
      <DataTable columns={columns} data={queueEntries} onRowClick={handleRowClick} />
    </div>
  );
}
