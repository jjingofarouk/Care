'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { getProgressNotes, deleteProgressNote } from '@/services/clinicalService';

export default function ProgressNotes() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const notes = await getProgressNotes();
        setData(notes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress notes:', error);
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
      header: 'Doctor',
      accessorFn: row => row.doctor.name,
    },
    {
      header: 'Note',
      accessorKey: 'note',
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
          <Link href={`/clinical/progress/${row.original.id}`}>
            <button className="text-hospital-accent hover:underline">View</button>
          </Link>
          <Link href={`/clinical/progress/edit/${row.original.id}`}>
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
      await deleteProgressNote(id);
      setData(data.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting progress note:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Progress Notes</h1>
        <Link href="/clinical/progress/new">
          <button className="bg-hospital-accent text-white px-4 py-2 rounded">
            Add New Note
          </button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(row) => router.push(`/clinical/progress/${row.original.id}`)}
      />
    </div>
  );
}
