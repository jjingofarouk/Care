import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography } from '@mui/material';
import { Trash2, Edit } from 'lucide-react';

const TravelHistoryList = ({ travelHistory = [], onEdit, onDelete }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'countryVisited', headerName: 'Country Visited', width: 200 },
    { 
      field: 'dateFrom', 
      headerName: 'Date From', 
      width: 150,
      type: 'date',
      valueGetter: (params) => params.row.dateFrom ? new Date(params.row.dateFrom) : null
    },
    { 
      field: 'dateTo', 
      headerName: 'Date To', 
      width: 150,
      type: 'date',
      valueGetter: (params) => params.row.dateTo ? new Date(params.row.dateTo) : null
    },
    { field: 'purpose', headerName: 'Purpose', width: 150 },
    { field: 'travelNotes', headerName: 'Notes', width: 200 },
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
      <Typography variant="h6" className="card-title mb-4">Travel History</Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={travelHistory}
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

export default TravelHistoryList;