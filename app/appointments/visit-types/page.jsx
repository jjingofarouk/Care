'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import VisitTypeForm from '@/components/appointments/VisitTypeForm';

export default function VisitTypesPage() {
  const [visitTypes, setVisitTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVisitType, setEditingVisitType] = useState(null);

  const fetchVisitTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments?resource=visitTypes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch visit types');
      const data = await response.json();
      setVisitTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/appointments?resource=visitType&id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to delete visit type');
      fetchVisitTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVisitTypes();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => params.row.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 400,
      renderCell: (params) => params.row.description || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton className="btn-outline" onClick={() => setEditingVisitType(params.row)}>
            <Edit className="h-4 w-4" />
          </IconButton>
          <IconButton className="btn-outline" onClick={() => handleDelete(params.row.id)}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </>
      ),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
  ];

  return (
    <div className="max-w-full mx-auto p-2 sm:p-4">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h4" className="text-[var(--hospital-gray-900)] font-bold">
          Visit Types
        </Typography>
        <Button
          variant="contained"
          className="btn-primary"
          startIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setEditingVisitType({})}
          component={Link}
          href="/appointments/visit-types/new"
        >
          New Visit Type
        </Button>
      </div>
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      {editingVisitType && (
        <VisitTypeForm
          visitType={editingVisitType}
          onSubmit={fetchVisitTypes}
          onCancel={() => setEditingVisitType(null)}
        />
      )}
      <div className="card w-full max-w-7xl mx-auto">
        <div style={{ height: 600, width: '100%' }} className="overflow-x-auto custom-scrollbar">
          <DataGrid
            rows={loading ? [] : visitTypes}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            loading={loading}
            disableSelectionOnClick
            autoHeight={false}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
                backgroundColor: 'var(--hospital-white)',
                borderRadius: '0.5rem',
                boxShadow: 'var(--shadow-sm)',
              },
              '& .MuiDataGrid-cell': {
                borderTop: '1px solid var(--hospital-gray-200)',
                color: 'var(--hospital-gray-900)',
                padding: '0.75rem 1.5rem',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'var(--hospital-gray-50)',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'var(--hospital-gray-50)',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'var(--hospital-gray-50)',
                borderTop: '1px solid var(--hospital-gray-200)',
              },
              '& .MuiDataGrid-overlay': {
                backgroundColor: 'var(--hospital-white)',
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <div className="flex justify-center items-center h-full text-[var(--hospital-gray-500)]">
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    'No visit types available'
                  )}
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}