'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { getLabTests, deleteLabTest } from '@/services/laboratoryService';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function LabTests() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const tests = await getLabTests();
        setData(tests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab tests:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
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
          <Link href={`/laboratory/tests/${row.original.id}`} className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] transition-colors">
            <Eye className="w-5 h-5" />
          </Link>
          <Link href={`/laboratory/tests/edit/${row.original.id}`} className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] transition-colors">
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
      await deleteLabTest(id);
      setData(data.filter(test => test.id !== id));
    } catch (error) {
      console.error('Error deleting lab test:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Lab Tests</h1>
        <Link href="/laboratory/tests/new">
          <button className="btn btn-primary gap-2">
            <Plus className="w-5 h-5" />
            Add New Test
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
            onRowClick={(row) => router.push(`/laboratory/tests/${row.original.id}`)}
            className="table"
          />
        </div>
      )}
    </div>
  );
}
