'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getRequisitions, deleteRequisition } from './cssdService';
import CssdRequisitionForm from './CssdRequisitionForm';
import styles from './CssdList.module.css';

export default function CssdRequisitionList() {
  const [requisitions, setRequisitions] = useState([]);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchRequisitions() {
      try {
        const data = await getRequisitions();
        const formattedRequisitions = data.map((req) => ({
          id: req.id,
          instrumentName: req.instrument?.name || 'N/A',
          serialNumber: req.instrument?.serialNumber || 'N/A',
          department: req.department,
          requestedBy: req.user?.name || 'N/A',
          quantity: req.quantity,
          requestDate: req.requestDate
            ? new Date(req.requestDate).toLocaleDateString()
            : 'N/A',
          dispatchDate: req.dispatchDate
            ? new Date(req.dispatchDate).toLocaleDateString()
            : 'N/A',
          status: req.status,
          notes: req.notes || 'N/A',
        }));
        setRequisitions(formattedRequisitions);
        setError(null);
      } catch (err) {
        setError('Failed to fetch requisitions');
      }
    }
    fetchRequisitions();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await deleteRequisition(id);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      setError('Failed to delete requisition');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'instrumentName', headerName: 'Instrument', width: 150 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'requestedBy', headerName: 'Requested By', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'requestDate', headerName: 'Request Date', width: 150 },
    { field: 'dispatchDate', headerName: 'Dispatch Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => console.log('View requisition', params.row.id)}
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
        Requisitions
      </Typography>
      <CssdRequisitionForm onSuccess={() => setRefresh((prev) => prev + 1)} />
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      {requisitions.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>No requisitions found.</Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={requisitions}
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
