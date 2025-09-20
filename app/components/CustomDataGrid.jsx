"use client";

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';

export default function CustomDataGrid({
  rows,
  columns,
  pageSizeOptions = [5, 10, 20],
  getRowId = (row) => row.id,
  ...props
}) {
  const enhancedColumns = columns.map((col) => {
    if (col.field.includes('date') || col.field.includes('Time')) {
      return {
        ...col,
        valueGetter: (params) => {
          try {
            const value = params.row?.[col.field];
            return value && !isNaN(new Date(value)) ? format(new Date(value), 'PPp') : 'N/A';
          } catch {
            return 'N/A';
          }
        },
      };
    }
    if (col.field.includes('Name')) {
      return {
        ...col,
        valueGetter: (params) => {
          const entity = col.field.includes('patient')
            ? params.row?.patient
            : params.row?.doctor || params.row;
          return entity?.user?.name || entity?.id || 'N/A';
        },
      };
    }
    return col;
  });

  return (
    <DataGrid
      rows={rows}
      columns={enhancedColumns}
      pageSizeOptions={pageSizeOptions}
      disableRowSelectionOnClick
      getRowId={getRowId}
      {...props}
    />
  );
}