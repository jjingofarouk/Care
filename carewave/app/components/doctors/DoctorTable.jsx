'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';

export default function DoctorTable({ doctors, onEdit, onDelete }) {
  const columns = [
    { 
      field: 'firstName', 
      headerName: 'First Name', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.row?.department?.name || 'No Department'}</span>
      ),
    },
    {
      field: 'specializations',
      headerName: 'Specializations',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-2 py-2">
          {params.row?.specializations?.length > 0 ? (
            params.row.specializations.map(spec => (
              <span key={spec.id} className="badge badge-info">
                {spec.specialization?.name || 'Unknown'}
              </span>
            ))
          ) : (
            <span className="text-[var(--hospital-gray-500)]">No specializations</span>
          )}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(params.row)}
            className="btn btn-outline p-2"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(params.row.id)}
            className="btn btn-danger p-2"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="table w-full">
      <DataGrid
        rows={doctors || []}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        className="custom-scrollbar bg-[var(--hospital-white)]"
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-root': {
            border: '1px solid var(--hospital-gray-200)',
            borderRadius: '0.75rem',
            boxShadow: 'var(--shadow-sm)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--hospital-gray-50)',
            color: 'var(--hospital-gray-500)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          },
          '& .MuiDataGrid-cell': {
            borderTop: '1px solid var(--hospital-gray-200)',
            padding: '0.75rem 1.5rem',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'var(--hospital-gray-50)',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'var(--hospital-gray-50)',
            borderTop: '1px solid var(--hospital-gray-200)',
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <div className="flex items-center justify-center h-full py-8">
              <span className="text-[var(--hospital-gray-500)]">No doctors found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-8">
              <div className="loading-spinner" />
            </div>
          ),
        }}
        loading={!doctors}
      />
    </div>
  );
}