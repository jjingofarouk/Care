// app/components/adt/BedStatus.js
'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Chip, Alert, CircularProgress } from '@mui/material';
import adtService from '../../services/adtService';

export default function BedStatus({ wardId }) {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // Track which bed is being updated

  useEffect(() => {
    fetchBeds();
  }, [wardId]);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const bedData = await adtService.getBeds(wardId ? { wardId } : {});
      setBeds(bedData);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setError('Failed to load bed status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (bedId, isOccupied) => {
    try {
      setUpdating(bedId);
      await adtService.updateBedStatus(bedId, !isOccupied);
      await fetchBeds(); // Refresh the data
    } catch (error) {
      console.error('Error updating bed status:', error);
      setError('Failed to update bed status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    { 
      field: 'bedNumber', 
      headerName: 'Bed Number', 
      flex: 1,
      valueGetter: (value, row) => row.bedNumber || 'N/A'
    },
    { 
      field: 'wardName', 
      headerName: 'Ward', 
      flex: 1,
      valueGetter: (value, row) => row.wardName || row.ward?.name || 'N/A'
    },
    {
      field: 'isOccupied',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Occupied' : 'Available'}
          color={params.value ? 'error' : 'success'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'patientName',
      headerName: 'Patient',
      flex: 1,
      valueGetter: (value, row) => {
        if (!row.isOccupied) return 'N/A';
        if (row.patient?.name) return row.patient.name;
        if (row.patient?.firstName && row.patient?.lastName) {
          return `${row.patient.firstName} ${row.patient.lastName}`;
        }
        if (row.admission?.patient?.name) return row.admission.patient.name;
        if (row.admission?.patient?.firstName && row.admission?.patient?.lastName) {
          return `${row.admission.patient.firstName} ${row.admission.patient.lastName}`;
        }
        return 'Occupied';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleToggleStatus(params.row.id, params.row.isOccupied)}
          disabled={updating === params.row.id}
        >
          {updating === params.row.id ? 'Updating...' : 'Toggle Status'}
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <DataGrid
        rows={beds}
        columns={columns}
        getRowId={(row) => row.id || `${row.bedNumber}-${row.wardName}`}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </Box>
  );
}