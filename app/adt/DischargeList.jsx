// app/adt/DischargeList.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import { getDischarges, updateDischarge, deleteDischarge } from './adtService';
import styles from './AdtList.module.css';

export default function DischargeList({ onSelectDischarge, refresh }) {
  const [discharges, setDischarges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDischarges() {
      try {
        const data = await getDischarges();
        const formattedDischarges = Array.isArray(data)
          ? data.map(discharge => ({
              id: discharge.id,
              patientName: discharge.patient?.user?.name || 'N/A',
              patientId: discharge.patient?.patientId || 'N/A',
              doctorName: discharge.doctor?.user?.name || 'N/A',
              dischargeDate: discharge.dischargeDate 
                ? new Date(discharge.dischargeDate).toLocaleDateString() 
                : 'N/A',
              dischargeNotes: discharge.dischargeNotes || 'N/A',
              followUpInstructions: discharge.followUpInstructions || 'N/A',
              medications: discharge.medications || 'N/A',
              rawData: discharge
            }))
          : [];
        setDischarges(formattedDischarges);
        setError(null);
      } catch (error) {
        console.error('Error fetching discharges:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchDischarges();
  }, [refresh]);

  const handleCellEditCommit = async (params, event, details) => {
    if (details.reason === GridCellEditStopReasons.cellEditEnd) {
      try {
        const updatedData = {
          ...params.row.rawData,
          [params.field]: params.value,
        };
        await updateDischarge(params.id, updatedData);
        setDischarges(discharges.map(row => 
          row.id === params.id ? { ...row, [params.field]: params.value } : row
        ));
      } catch (error) {
        console.error('Error updating discharge:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDischarge(id);
      setDischarges(discharges.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting discharge:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150, editable: true },
    { field: 'patientId', headerName: 'Patient ID', width: 120 },
    { field: 'doctorName', headerName: 'Doctor', width: 150, editable: true },
    { field: 'dischargeDate', headerName: 'Discharge Date', width: 150, editable: true },
    { field: 'dischargeNotes', headerName: 'Discharge Notes', width: 200, editable: true },
    { field: 'followUpInstructions', headerName: 'Follow-up Instructions', width: 200, editable: true },
    { field: 'medications', headerName: 'Medications', width: 200, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => onSelectDischarge(params.row.rawData)}
            disabled={!params.row.rawData}
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
        Discharges
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load discharges: {error}
        </Alert>
      )}
      {discharges.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No discharges found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={discharges}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className={styles.dataGrid}
          onCellEditStop={handleCellEditCommit}
        />
      </Box>
    </Box>
  );
}