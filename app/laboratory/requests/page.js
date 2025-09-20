'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  const handleRowClick = (rowData) => {
    // Navigate to the detail view when a row is clicked
    router.push(`/laboratory/requests/${rowData.id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteLabRequest(id);
      setData(data.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error deleting lab request:', error);
    }
  };

  const columns = [
    {
      header: 'Patient',
      accessorFn: row => `${row.patient.firstName} ${row.patient.lastName}`,
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
      cell: ({ row }) => new Date(row.original.requestedAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2" data-no-row-click>
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
            onRowClick={handleRowClick}
            enableRowSelection={false}
            className="table"
          />
        </div>
      )}
    </div>
  );
}