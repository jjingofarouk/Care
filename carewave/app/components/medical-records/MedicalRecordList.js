'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Trash2 } from 'lucide-react';
import { IconButton } from '@mui/material';

const MedicalRecordList = ({ records, onDelete }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'patientName', headerName: 'Patient', width: 200, valueGetter: (params) => params.row.patient?.name || 'N/A' },
    { field: 'recordDate', headerName: 'Record Date', width: 150, type: 'date', valueGetter: (params) => new Date(params.row.recordDate) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton onClick={() => console.log('Edit', params.row.id)} className="text-[var(--hospital-accent)]">
            <Edit size={20} />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row.id)} className="text-[var(--hospital-error)]">
            <Trash2 size={20} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="table">
        <DataGrid
          rows={records}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          className="w-full"
          autoHeight
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default MedicalRecordList;