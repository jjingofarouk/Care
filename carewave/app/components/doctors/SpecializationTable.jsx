'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';

export default function SpecializationTable({ specializations, onEdit, onDelete }) {
  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    {
      field: 'doctors',
      headerName: 'Doctors',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-2 py-2">
          {params.row.doctors?.length > 0 ? (
            params.row.doctors.map(doc => (
              <span key={doc.id} className="badge badge-info">
                {doc.doctor ? `${doc.doctor.firstName} ${doc.doctor.lastName}` : 'Unknown'}
              </span>
            ))
          ) : (
            <span className="text-[var(--hospital-gray-500)]">No doctors</span>
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
        rows={specializations || []}
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
              <span className="text-[var(--hospital-gray-500)]">No specializations found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-8">
              <div className="loading-spinner" />
            </div>
          ),
        }}
        loading={!specializations}
      />
    </div>
  );
}