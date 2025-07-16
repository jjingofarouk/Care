'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { getLabResults, deleteLabResult } from '@/services/laboratoryService';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function LabResults() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await getLabResults();
        setData(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab results:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Patient',
      accessorFn: row => `${row.labRequest.patient.firstName} ${row.labRequest.patient.lastName}`,
    },
    {
      header: 'Lab Test',
      accessorFn: row => row.labRequest.labTest.name,
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
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link href={`/laboratory/results/${row.original.id}`} className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] transition-colors">
            <Eye className="w-5 h-5" />
          </Link>
          <Link href={`/laboratory/results/edit/${row.original.id}`} className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] transition-colors">
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-[var(--hospital-error)] hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteLabResult(id);
      setData(data.filter(result => result.id !== id));
    } catch (error) {
      console.error('Error deleting lab result:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Lab Results</h1>
        <Link href="/laboratory/results/new">
          <button className="btn btn-primary gap-2">
            <Plus className="w-5 h-5" />
            Add New Result
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="card">
          <div className="p-6 space-y-4">
            <div className="skeleton-text" />
            <div className="skeleton-text" />
            <div className="skeleton-text" />
          </div>
        </div>
      ) : (
        <div className="card">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            onRowClick={(row) => router.push(`/laboratory/results/${row.original.id}`)}
            className="table"
          />
        </div>
      )}
    </div>
  );
}
