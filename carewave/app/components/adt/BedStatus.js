// app/components/adt/BedStatus.js
'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Chip } from '@mui/material';
import { Bed } from 'lucide-react';
import adtService from '../../services/adtService';

export default function BedStatus({ wardId }) {
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    fetchBeds();
  }, [wardId]);

  const fetchBeds = async () => {
    try {
      const bedData = await adtService.getBeds(wardId ? { wardId } : {});
      setBeds(bedData);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  const handleToggleStatus = async (bedId, isOccupied) => {
    try {
      await adtService.updateBedStatus(bedId, !isOccupied);
      fetchBeds();
    } catch (error) {
      console.error('Error updating bed status:', error);
    }
  };

  const columns = [
    { field: 'bedNumber', headerName: 'Bed Number', flex: 1 },
    { field: 'wardName', headerName: 'Ward', flex: 1 },
    {
      field: 'isOccupied',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Occupied' : 'Available'}
          color={params.value ? 'error' : 'success'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleToggleStatus(params.row.id, params.row.isOccupied)}
        >
          Toggle Status
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={beds}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
      />
    </Box>
  );
}