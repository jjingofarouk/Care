// components/ScheduleTable.jsx
'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';

export default function ScheduleTable({ schedules, onEdit, onDelete }) {
  const columns = [
    { 
      field: 'doctor', 
      headerName: 'Doctor', 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">
          {params.row.doctor ? `${params.row.doctor.firstName} ${params.row.doctor.lastName}` : 'N/A'}
        </span>
      )
    },
    { 
      field: 'dayOfWeek', 
      headerName: 'Day', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      )
    },
    { 
      field: 'startTime', 
      headerName: 'Start Time', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">
          {params.value ? new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
        </span>
      )
    },
    { 
      field: 'endTime', 
      headerName: 'End Time', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">
          {params.value ? new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(params.row)}
            className="btn btn-outline p-1"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(params.row.id)}
            className="btn btn-danger p-1"
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
        rows={schedules || []}
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
            padding: '0.25rem 0.75rem',
          },
          '& .MuiDataGrid-cell': {
            borderTop: '1px solid var(--hospital-gray-200)',
            padding: '0.25rem 0.75rem',
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
            <div className="flex items-center justify-center h-full py-2">
              <span className="text-[var(--hospital-gray-500)]">No schedules found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-2">
              <div className="loading-spinner" />
            </div>
          ),
        }}
        loading={!schedules}
      />
    </div>
  );
}