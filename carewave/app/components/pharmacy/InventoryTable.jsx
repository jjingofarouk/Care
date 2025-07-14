'use client';
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';

export default function InventoryTable({ inventory = [] }) {
  const columns = [
    {
      field: 'drugName',
      headerName: 'Drug',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'batchNumber',
      headerName: 'Batch Number',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return format(new Date(params.value), 'PP');
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.5,
      minWidth: 100,
      type: 'number',
    },
  ];

  const rows = inventory.map((item) => ({
    id: item.id,
    drugName: item.drug?.name || '',
    batchNumber: item.batchNumber || '',
    expiryDate: item.expiryDate,
    quantity: item.quantity || 0,
  }));

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Pharmacy Inventory</h2>
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
          className="border-0"
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
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'none',
            },
          }}
        />
      </div>
    </div>
  );
}