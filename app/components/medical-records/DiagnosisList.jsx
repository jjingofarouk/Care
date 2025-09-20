import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography } from '@mui/material';
import { Trash2, Edit } from 'lucide-react';

const DiagnosisList = ({ diagnoses = [], onEdit, onDelete }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'code', headerName: 'Code', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { 
      field: 'diagnosedAt', 
      headerName: 'Diagnosed At', 
      width: 150,
      type: 'date',
      valueGetter: (params) => new Date(params.row.diagnosedAt)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
            className="btn-outline"
            startIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onDelete(params.row.id)}
            className="btn-danger"
            startIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className="card p-6">
      <Typography variant="h6" className="card-title mb-4">Diagnoses</Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={diagnoses}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          className="table"
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default DiagnosisList;