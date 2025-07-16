'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { getClinicalTasks, deleteClinicalTask } from '@/services/clinicalService';

export default function ClinicalTasks() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const tasks = await getClinicalTasks();
        setData(tasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clinical tasks:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Patient',
      accessorFn: row => `${row.patient.firstName} ${row.patient.lastName}`,
    },
    {
      header: 'Assigned To',
      accessorKey: 'assignedToId',
    },
    {
      header: 'Type',
      accessorKey: 'assignedToType',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link href={`/clinical/tasks/${row.original.id}`}>
            <button className="text-hospital-accent hover:underline">View</button>
          </Link>
          <Link href={`/clinical/tasks/edit/${row.original.id}`}>
            <button className="text-hospital-accent hover:underline">Edit</button>
          </Link>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteClinicalTask(id);
      setData(data.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting clinical task:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clinical Tasks</h1>
        <Link href="/clinical/tasks/new">
          <button className="bg-hospital-accent text-white px-4 py-2 rounded">
            Add New Task
          </button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(row) => router.push(`/clinical/tasks/${row.original.id}`)}
      />
    </div>
  );
}
