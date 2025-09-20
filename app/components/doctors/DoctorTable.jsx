'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';

export default function DoctorTable({ doctors = [], onEdit, onDelete }) {
  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => (
        <span className="text-gray-900">{value || 'N/A'}</span>
      ),
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => (
        <span className="text-gray-900">{value || 'N/A'}</span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      renderCell: ({ value }) => (
        <span className="text-gray-900">{value || 'N/A'}</span>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 130,
      renderCell: ({ value }) => (
        <span className="text-gray-900">{value || 'N/A'}</span>
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 140,
      renderCell: ({ row }) => (
        <span className="text-gray-900">
          {row?.department?.name || 'No Department'}
        </span>
      ),
    },
    {
      field: 'specializations',
      headerName: 'Specializations',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row?.specializations?.length > 0 ? (
            row.specializations.map((spec) => (
              <span
                key={spec.id}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded"
              >
                {spec.specialization?.name || 'Unknown'}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No specializations</span>
          )}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row)}
            title="Edit"
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            <Edit fontSize="small" />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            title="Delete"
            className="text-red-600 hover:text-red-800 p-1"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto px-1.5 sm:px-3 lg:px-4 py-1.5">
      <DataGrid
        rows={doctors}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        className="bg-white"
        sx={{
          '& .MuiDataGrid-root': {
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            fontFamily: 'inherit',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F9FAFB',
            color: '#6B7280',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            borderBottom: '1px solid #E5E7EB',
            paddingY: '0.5rem',
          },
          '& .MuiDataGrid-cell': {
            borderTop: '1px solid #E5E7EB',
            fontSize: '0.875rem',
            paddingY: '0.5rem',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#F3F4F6',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#F9FAFB',
            borderTop: '1px solid #E5E7EB',
            padding: '0.5rem',
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <div className="flex items-center justify-center h-full py-4">
              <span className="text-gray-500">No doctors found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-4">
              <span className="text-gray-500">Loading...</span>
            </div>
          ),
        }}
        loading={!doctors.length}
      />
    </div>
  );
}