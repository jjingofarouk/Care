'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getInstruments, deleteInstrument } from './cssdService';
import CssdInstrumentForm from './CssdInstrumentForm';
import styles from './CssdList.module.css';

export default function CssdInstrumentList() {
  const [instruments, setInstruments] = useState([]);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const data = await getInstruments();
        const formattedInstruments = data.map((instrument) => ({
          id: instrument.id,
          name: instrument.name,
          serialNumber: instrument.serialNumber,
          type: instrument.type || 'N/A',
          status: instrument.status,
          lastSterilized: instrument.lastSterilized
            ? new Date(instrument.lastSterilized).toLocaleDateString()
            : 'N/A',
          location: instrument.location || 'N/A',
          stockQuantity: instrument.stockQuantity,
          minStockThreshold: instrument.minStockThreshold,
        }));
        setInstruments(formattedInstruments);
        setError(null);
      } catch (err) {
        setError('Failed to fetch instruments');
      }
    }
    fetchInstruments();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await deleteInstrument(id);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      setError('Failed to delete instrument');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'lastSterilized', headerName: 'Last Sterilized', width: 150 },
    { field: 'location', headerName: 'Location', width: 120 },
    { field: 'stockQuantity', headerName: 'Stock Quantity', width: 120 },
    { field: 'minStockThreshold', headerName: 'Min Stock', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => console.log('View instrument', params.row.id)}
            className={styles.actionButton}
            sx={{ mr: 1 }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            className={styles.actionButton}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        CSSD Instruments
      </Typography>
      <CssdInstrumentForm onSuccess={() => setRefresh((prev) => prev + 1)} />
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      {instruments.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>No instruments found.</Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={instruments}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          className={styles.dataGrid}
        />
      </Box>
    </Box>
  );
}