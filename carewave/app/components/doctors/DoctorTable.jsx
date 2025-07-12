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
        <span className="text-gray-900">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-gray-900">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <span className="text-gray-900">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-gray-900">{params.value || 'N/A'}</span>
      )
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span className="text-gray-900">{params.row?.department?.name || 'No Department'}</span>
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
              <span key={spec.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {spec.specialization?.name || 'Unknown'}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No specializations</span>
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
            className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(params.row.id)}
            className="p-2 border border-red-300 bg-red-50 rounded-md text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors"
          >
            <Delete className="h-5 w-5" />
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
        className="bg-white"
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-root': {
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            borderBottom: '1px solid #e5e7eb',
          },
          '& .MuiDataGrid-cell': {
            borderTop: '1px solid #e5e7eb',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f9fafb',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            padding: '0.5rem',
          },
          '& .custom-scrollbar': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6',
          },
          '& .custom-scrollbar::-webkit-scrollbar': {
            height: '8px',
          },
          '& .custom-scrollbar::-webkit-scrollbar-track': {
            background: '#f3f4f6',
            borderRadius: '4px',
          },
          '& .custom-scrollbar::-webkit-scrollbar-thumb': {
            background: '#d1d5db',
            borderRadius: '4px',
          },
          '& .custom-scrollbar::-webkit-scrollbar-thumb:hover': {
            background: '#9ca3af',
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <div className="flex items-center justify-center h-full py-8">
              <span className="text-gray-500">No doctors found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-8">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ),
        }}
        loading={!doctors}
      />
    </div>
  );
}