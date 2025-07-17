'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '@/components/DataTable';
import { getLabRequests, deleteLabRequest } from '@/services/laboratoryService';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function LabRequests() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const requests = await getLabRequests();
        setData(requests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab requests:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Patient',
      accessorFn: row => row.patient.name,
    },
    {
      header: 'Lab Test',
      accessorFn: row => row.labTest.name,
    },
    {
      header: 'Sample',
      accessorFn: row => row.sample?.sampleType || 'N/A',
    },
    {
      header: 'Requested At',
      accessorKey: 'requestedAt',
      cell: ({ row }) => new Date(row.original.requestedAt).toLocaleString(),
    },
    {
      header: 'Results',
      accessorFn: row => row.labResults.length > 0 ? row.labResults[0].result : 'Pending',
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link href={`/laboratory/requests/${row.original.id}`} className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] transition-colors">
            <Eye className="w-5 h-5" />
          </Link>
          <Link href={`/laboratory/requests/edit/${row.original.id}`} className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] transition-colors">
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
    if (confirm('Are you sure you want to delete this lab request?')) {
      try {
        await deleteLabRequest(id);
        setData(data.filter(request => request.id !== id));
      } catch (error) {
        console.error('Error deleting lab request:', error);
        alert('Failed to delete lab request');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">Lab Requests</h1>
        <Link href="/laboratory/requests/new">
          <button className="btn btn-primary gap-2">
            <Plus className="w-5 h-5" />
            Add New Request
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
            onRowClick={(row) => router.push(`/laboratory/requests/edit/${row.original.id}`)}
            className="table"
          />
        </div>
      )}
    </div>
  );
}