'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getCssdLogs } from './cssdService';
import styles from './CssdList.module.css';

export default function CssdLogList() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getCssdLogs();
        const formattedLogs = data.map((log) => ({
          id: log.id,
          instrumentName: log.instrument?.name || 'N/A',
          recordId: log.recordId || 'N/A',
          requisitionId: log.requisitionId || 'N/A',
          action: log.action,
          details: log.details || 'N/A',
          performedBy: log.user?.name || 'N/A',
          timestamp: log.timestamp
            ? new Date(log.timestamp).toLocaleDateString()
            : 'N/A',
        }));
        setLogs(formattedLogs);
        setError(null);
      } catch (err) {
        setError('Failed to fetch logs');
      }
    }
    fetchLogs();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'instrumentName', headerName: 'Instrument', width: 150 },
    { field: 'recordId', headerName: 'Record ID', width: 120 },
    { field: 'requisitionId', headerName: 'Requisition ID', width: 120 },
    { field: 'action', headerName: 'Action', width: 150 },
    { field: 'details', headerName: 'Details', width: 200 },
    { field: 'performedBy', headerName: 'Performed By', width: 150 },
    { field: 'timestamp', headerName: 'Timestamp', width: 150 },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Audit Logs
      </Typography>
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      {logs.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>No logs found.</Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={logs}
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
