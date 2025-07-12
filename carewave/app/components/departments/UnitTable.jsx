'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function UnitTable({ units, onEdit, onDelete }) {
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      valueGetter: (params) => params.row.department?.name || '',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton
            onClick={() => onEdit(params.row)}
            className="btn btn-outline"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => onDelete(params.row.id)}
            className="btn btn-danger"
          >
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="table" style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={units}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        className="custom-scrollbar"
      />
    </div>
  );
}