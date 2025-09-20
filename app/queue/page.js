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
  columnHelper.accessor('patient', {
    header: 'Patient',
    cell: info => {
      const patient = info.getValue();
      return patient ? `${patient.firstName} ${patient.lastName}` : '';
    },
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const patientA = rowA.original.patient;
      const patientB = rowB.original.patient;
      
      if (!patientA && !patientB) return 0;
      if (!patientA) return 1;
      if (!patientB) return -1;
      
      const nameA = `${patientA.firstName} ${patientA.lastName}`.toLowerCase();
      const nameB = `${patientB.firstName} ${patientB.lastName}`.toLowerCase();
      
      return nameA.localeCompare(nameB);
    },
    filterFn: (row, columnId, filterValue) => {
      const patient = row.original.patient;
      if (!patient) return false;
      
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  }),
  columnHelper.accessor('serviceCounter', {
    header: 'Service Counter',
    cell: info => {
      const serviceCounter = info.getValue();
      return serviceCounter ? serviceCounter.name : '';
    },
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const counterA = rowA.original.serviceCounter;
      const counterB = rowB.original.serviceCounter;
      
      if (!counterA && !counterB) return 0;
      if (!counterA) return 1;
      if (!counterB) return -1;
      
      return counterA.name.localeCompare(counterB.name);
    },
    filterFn: (row, columnId, filterValue) => {
      const serviceCounter = row.original.serviceCounter;
      if (!serviceCounter) return false;
      
      return serviceCounter.name.toLowerCase().includes(filterValue.toLowerCase());
    },
  }),
  columnHelper.accessor('queueStatus', {
    header: 'Status',
    cell: info => {
      const queueStatus = info.getValue();
      return queueStatus ? queueStatus.name : '';
    },
    enableSorting: true,
    enableColumnFilter: true,
    sortingFn: (rowA, rowB) => {
      const statusA = rowA.original.queueStatus;
      const statusB = rowB.original.queueStatus;
      
      if (!statusA && !statusB) return 0;
      if (!statusA) return 1;
      if (!statusB) return -1;
      
      return statusA.name.localeCompare(statusB.name);
    },
    filterFn: (row, columnId, filterValue) => {
      const queueStatus = row.original.queueStatus;
      if (!queueStatus) return false;
      
      return queueStatus.name.toLowerCase().includes(filterValue.toLowerCase());
    },
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
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQueueEntries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const entries = await queueService.getAll();
        setQueueEntries(entries);
      } catch (error) {
        console.error('Error fetching queue entries:', error);
        setError('Failed to load queue entries. Please try again.');
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

  const handleRefresh = () => {
    const fetchQueueEntries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const entries = await queueService.getAll();
        setQueueEntries(entries);
      } catch (error) {
        console.error('Error fetching queue entries:', error);
        setError('Failed to load queue entries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueueEntries();
  };

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Queue Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-[var(--hospital-gray-200)] text-[var(--hospital-gray-700)] px-4 py-2 rounded-md hover:bg-[var(--hospital-gray-300)] transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={() => router.push('/queue/new')}
            className="bg-[var(--hospital-accent)] text-white px-4 py-2 rounded-md hover:bg-[var(--hospital-accent-dark)] transition-colors duration-200"
          >
            Add Queue Entry
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
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