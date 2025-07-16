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
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('patient.name', {
    header: 'Patient',
    cell: info => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('serviceCounter.name', {
    header: 'Service Counter',
    cell: info => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('queueStatus.name', {
    header: 'Status',
    cell: info => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: info => new Date(info.getValue()).toLocaleString(),
    enableSorting: true,
    enableColumnFilter: false,
  }),
];

export default function QueuePage() {
  const [queueEntries, setQueueEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQueueEntries = async () => {
      try {
        setIsLoading(true);
        const entries = await queueService.getAll();
        setQueueEntries(entries);
      } catch (error) {
        console.error('Error fetching queue entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueueEntries();
  }, []);

  const handleRowClick = (row) => {
    router.push(`/queue/${row.original.id}`);
  };

  const handleSelectionChange = (selectedRows) => {
    console.log('Selected rows:', selectedRows);
  };

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Queue Management</h1>
        <button
          onClick={() => router.push('/queue/new')}
          className="bg-[var(--hospital-accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--hospital-accent-dark)] transition-colors duration-200"
        >
          Add Queue Entry
        </button>
      </div>
      <DataTable
        columns={columns}
        data={queueEntries}
        onRowClick={handleRowClick}
        loading={isLoading}
        onSelectionChange={handleSelectionChange}
        enableRowSelection={true}
        enableColumnManagement={true}
        enableExport={true}
        enableAdvancedFiltering={true}
        enableRowStriping={true}
      />
    </div>
  );
}