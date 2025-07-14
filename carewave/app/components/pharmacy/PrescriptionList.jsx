'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';

export default function PrescriptionList({ prescriptions = [] }) {
  const columns = [
    {
      field: 'patient',
      headerName: 'Patient',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.row.patient?.user?.name || '',
    },
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.row.doctor?.user?.name || '',
    },
    {
      field: 'drug',
      headerName: 'Drug',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.drug?.name || '',
    },
    {
      field: 'dosage',
      headerName: 'Dosage',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'prescribedAt',
      headerName: 'Prescribed At',
      flex: 1,
      minWidth: 180,
      type: 'dateTime',
      valueGetter: (params) => params.row.prescribedAt ? new Date(params.row.prescribedAt) : null,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return format(new Date(params.value), 'PPp');
      },
    },
  ];

  const rows = prescriptions.map((prescription) => ({
    id: prescription.id,
    patient: prescription.patient,
    doctor: prescription.doctor,
    drug: prescription.drug,
    dosage: prescription.dosage || '',
    prescribedAt: prescription.prescribedAt,
  }));

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Prescriptions</h2>
      </div>
      <div className="h-96 w-full">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e5e7eb',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: 600,
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
            },
            '& .MuiCheckbox-root': {
              color: '#6b7280',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb',
            },
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'none',
            },
          }}
        />
      </div>
    </div>
  );
}