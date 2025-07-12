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
        rows={schedules || []}
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
              <span className="text-[var(--hospital-gray-500)]">No schedules found</span>
            </div>
          ),
          loadingOverlay: () => (
            <div className="flex items-center justify-center h-full py-8">
              <div className="loading-spinner" />
            </div>
          ),
        }}
        loading={!schedules}
      />
    </div>
  );
}