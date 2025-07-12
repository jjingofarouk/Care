// components/DoctorTable.jsx
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
        <div className="flex flex-wrap gap-2 py-1">
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
            className="btn btn-outline p-1.5"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(params.row.id)}
            className="btn btn-danger p-1.5"
          >
            <Delete className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <DataGrid
        rows={doctors || []}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        className="bg-[var(--hospital-white)] custom-scrollbar"
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-root': {
            border: '1px solid var(--hospital-gray-200)',
            borderRadius: '0.5rem',
            boxShadow: 'var(--shadow-sm)',
            width: '100%',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--hospital-gray-50)',
            color: 'var(--hospital-gray-500)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--hospital-gray-200)',
            padding: '0.5rem 1rem',
          },
          '& .MuiDataGrid-cell': {
            borderTop: '1px solid var(--hospital-gray-200)',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'var(--hospital-gray-50)',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'var(--hospital-gray-50)',
            borderTop: '1px solid var(--hospital-gray-200)',
            padding: '0.25rem',
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <div className="flex items-center justify-center h-full py-4">
              <span className="text-[var(--hospital-gray-500)]">No doctors found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-4">
              <div className="loading-spinner" />
            </div>
          ),
        }}
        loading={!doctors}
      />
    </div>
  );
}