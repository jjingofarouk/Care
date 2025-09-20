'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { getMedicalRecords, deleteMedicalRecord } from '@/services/medicalRecordsService';

export default function MedicalRecordList() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [searchQuery]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMedicalRecords({
        search: searchQuery,
        include: 'chiefComplaint,diagnoses',
      });
      setRecords(data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError(error.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this medical record?')) return;
    try {
      await deleteMedicalRecord(id);
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    } catch (error) {
      console.error('Error deleting medical record:', error);
      alert('Failed to delete medical record: ' + error.message);
    }
  };

  const handleView = (id) => router.push(`/medical-records/${id}`);
  const handleEdit = (id) => router.push(`/medical-records/${id}/edit`);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getChiefComplaint = (record) => record?.chiefComplaint?.description || 'N/A';
  const getPatientName = (record) => {
    if (!record?.patient) return 'N/A';
    const firstName = record.patient.firstName || '';
    const lastName = record.patient.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };
  const getDiagnosis = (record) => record?.diagnoses?.[0]?.description || 'N/A';

  const columns = [
    {
      field: 'id',
      headerName: 'Record ID',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="font-mono text-[var(--hospital-gray-900)] text-sm">
          {params.value || 'N/A'}
        </span>
      ),
    },
    {
      field: 'patientName',
      headerName: 'Patient Name',
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => getPatientName(row),
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)] text-sm">{params.value}</span>
      ),
    },
    {
      field: 'recordDate',
      headerName: 'Record Date',
      flex: 1,
      minWidth: 130,
      valueGetter: (value, row) => formatDate(row.recordDate),
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)] text-sm">{params.value}</span>
      ),
    },
    {
      field: 'chiefComplaint',
      headerName: 'Chief Complaint',
      flex: 1,
      minWidth: 250,
      valueGetter: (value, row) => getChiefComplaint(row),
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)] text-sm truncate">
          {params.value}
        </span>
      ),
    },
    {
      field: 'diagnosis',
      headerName: 'Diagnosis',
      flex: 1,
      minWidth: 250,
      valueGetter: (value, row) => getDiagnosis(row),
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)] text-sm truncate">
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        if (!params.row?.id) return null;
        return (
          <div className="flex gap-1">
            <button
              onClick={() => handleView(params.row.id)}
              className="btn btn-outline p-2 min-h-0 h-8"
              title="View Record"
            >
              <Visibility className="!w-4 !h-4" />
            </button>
            <button
              onClick={() => handleEdit(params.row.id)}
              className="btn btn-outline p-2 min-h-0 h-8"
              title="Edit Record"
            >
              <Edit className="!w-4 !h-4" />
            </button>
            <button
              onClick={() => handleDelete(params.row.id)}
              className="btn btn-danger p-2 min-h-0 h-8"
              title="Delete Record"
            >
              <Delete className="!w-4 !h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="card m-0 p-4">
        <h1 className="card-title mb-2">Medical Records</h1>

        {error && (
          <div className="alert alert-error mb-2">
            Error loading medical records: {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-80"
          />
          <button
            onClick={() => router.push('/medical-records/new')}
            className="btn btn-primary"
          >
            New Medical Record
          </button>
        </div>

        <div className="w-full">
          <DataGrid
            rows={records}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
            autoHeight
            className="table custom-scrollbar"
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: 'var(--shadow-sm)',
              },
              '& .MuiDataGrid-cell': {
                padding: '0.5rem 1rem',
                borderBottom: '1px solid var(--hospital-gray-200)',
                color: 'var(--hospital-gray-900)',
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-columnHeader': {
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--hospital-gray-50)',
                color: 'var(--hospital-gray-500)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'var(--hospital-gray-50)',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'var(--hospital-white)',
                borderTop: '1px solid var(--hospital-gray-200)',
              },
            }}
            slots={{
              noRowsOverlay: () => (
                <div className="flex justify-center items-center h-96">
                  <span className="text-[var(--hospital-gray-500)] text-base">
                    {searchQuery ? 'No records found matching your search' : 'No medical records found'}
                  </span>
                </div>
              ),
              loadingOverlay: () => (
                <div className="flex justify-center items-center h-96">
                  <div className="loading-spinner"></div>
                </div>
              ),
            }}
          />
        </div>

        {records.length > 0 && (
          <div className="mt-2 text-sm text-[var(--hospital-gray-500)]">
            Total records: {records.length}
          </div>
        )}
      </div>
    </div>
  );
}