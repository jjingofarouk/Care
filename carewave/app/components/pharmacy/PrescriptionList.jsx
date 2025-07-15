'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Plus, Edit, Delete, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function PrescriptionList() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [search]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/prescriptions?search=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch prescriptions: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      const validatedPrescriptions = data.map((prescription) => ({
        id: prescription.id || '',
        patient: prescription.patient || { name: '' },
        doctor: prescription.doctor || { name: '' },
        drug: prescription.drug || { name: '' },
        dosage: prescription.dosage || '',
        prescribedAt: prescription.prescribedAt || '',
      })).filter(Boolean);

      setPrescriptions(validatedPrescriptions);
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
      setError(err.message);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/prescriptions?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete prescription: ${response.status}`);
      }

      setPrescriptions((prev) => prev.filter((prescription) => prescription.id !== id));
    } catch (err) {
      console.error('Failed to delete prescription:', err);
      alert(`Failed to delete prescription: ${err.message}`);
    }
  };

  const columns = [
    {
      field: 'patientName',
      headerName: 'Patient',
      width: 200,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => params.row.patient?.name || '-',
    },
    {
      field: 'doctorName',
      headerName: 'Doctor',
      width: 200,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => params.row.doctor?.name ? `Dr. ${params.row.doctor.name}` : '-',
    },
    {
      field: 'drugName',
      headerName: 'Drug',
      width: 150,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => params.row.drug?.name || '-',
    },
    {
      field: 'dosage',
      headerName: 'Dosage',
      width: 150,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
    {
      field: 'prescribedAt',
      headerName: 'Prescribed At',
      width: 180,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) =>
        params.row.prescribedAt ? format(new Date(params.row.prescribedAt), 'PPp') : '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => (
        <div className="flex gap-1">
          <button
            className="btn btn-outline !p-2"
            onClick={() => router.push(`/pharmacy/prescriptions/${params.row.id}`)}
            title="View Prescription"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline !p-2"
            onClick={() => router.push(`/pharmacy/prescriptions/new?id=${params.row.id}`)}
            title="Edit Prescription"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline !p-2 text-[var(--hospital-error)] border-[var(--hospital-error)] hover:bg-[var(--hospital-error)] hover:text-[var(--hospital-white)]"
            onClick={() => handleDelete(params.row.id)}
            title="Delete Prescription"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="card p-2 max-w-[1280px] mx-auto mobile-full-width">
      <div className="flex justify-between items-center mb-3">
        <h1 className="card-title">Prescriptions</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/pharmacy/prescriptions/new')}
        >
          <Plus className="w-5 h-5" />
          New Prescription
        </button>
      </div>

      <div className="mb-3 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hospital-gray-400)]" />
          <input
            type="text"
            placeholder="Search by patient or drug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-3">
          <span>Error: {error}</span>
          <button className="btn btn-outline" onClick={fetchPrescriptions}>
            Retry
          </button>
        </div>
      )}

      <div className="table w-full">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="loading-spinner" />
          </div>
        ) : (
          <DataGrid
            rows={prescriptions}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            classes={{
              root: 'table',
              columnHeaders: 'bg-[var(--hospital-gray-50)]',
              row: 'hover:bg-[var(--hospital-gray-50)]',
              cell: 'py-2',
            }}
            localeText={{ noRowsLabel: 'No prescriptions found' }}
          />
        )}
      </div>
    </div>
  );
}