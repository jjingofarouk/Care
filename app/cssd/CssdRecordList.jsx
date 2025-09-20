'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getCssdRecords, deleteCssdRecord } from './cssdService';
import CssdForm from './CssdForm';
import styles from './CssdList.module.css';

export default function CssdRecordList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const data = await getCssdRecords();
        const formattedRecords = data.map((record) => ({
          id: record.id,
          instrumentName: record.instrument?.name || 'N/A',
          serialNumber: record.instrument?.serialNumber || 'N/A',
          sterilizationDate: record.sterilizationDate
            ? new Date(record.sterilizationDate).toLocaleDateString()
            : 'N/A',
          sterilizationMethod: record.sterilizationMethod || 'N/A',
          cycleNumber: record.cycleNumber || 'N/A',
          status: record.status,
          qualityCheck: record.qualityCheck || 'N/A',
          notes: record.notes || 'N/A',
        }));
        setRecords(formattedRecords);
        setError(null);
      } catch (err) {
        setError('Failed to fetch CSSD records');
      }
    }
    fetchRecords();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await deleteCssdRecord(id);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      setError('Failed to delete CSSD record');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'instrumentName', headerName: 'Instrument', width: 150 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 150 },
    { field: 'sterilizationDate', headerName: 'Sterilization Date', width: 150 },
    { field: 'sterilizationMethod', headerName: 'Method', width: 120 },
    { field: 'cycleNumber', headerName: 'Cycle Number', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'qualityCheck', headerName: 'Quality Check', width: 120 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => console.log('View record', params.row.id)}
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
        Sterilization Records
      </Typography>
      <CssdForm onSuccess={() => setRefresh((prev) => prev + 1)} />
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      {records.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>No records found.</Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={records}
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
