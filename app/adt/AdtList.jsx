// app/adt/AdmissionList.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import { getAdmissions, updateAdmission, deleteAdmission } from './adtService';
import styles from './AdtList.module.css';

export default function AdmissionList({ onSelectAdmission, refresh }) {
  const [admissions, setAdmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        const formattedAdmissions = Array.isArray(data)
          ? data.map(admission => ({
              id: admission.id,
              patientName: admission.patient?.user?.name || 'N/A',
              patientId: admission.patient?.patientId || 'N/A',
              wardName: admission.ward?.name || 'N/A',
              admissionDate: admission.admissionDate 
                ? new Date(admission.admissionDate).toLocaleDateString() 
                : 'N/A',
              doctorName: admission.doctor?.user?.name || 'N/A',
              triagePriority: admission.triagePriority || 'N/A',
              presentingComplaints: admission.presentingComplaints || 'N/A',
              relayedInfo: admission.relayedInfo || 'N/A',
              status: admission.status || 'N/A',
              rawData: admission
            }))
          : [];
        setAdmissions(formattedAdmissions);
        setError(null);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchAdmissions();
  }, [refresh]);

  const handleCellEditCommit = async (params, event, details) => {
    if (details.reason === GridCellEditStopReasons.cellEditEnd) {
      try {
        const updatedData = {
          ...params.row.rawData,
          [params.field]: params.value,
        };
        await updateAdmission(params.id, updatedData);
        setAdmissions(admissions.map(row => 
          row.id === params.id ? { ...row, [params.field]: params.value } : row
        ));
      } catch (error) {
        console.error('Error updating admission:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdmission(id);
      setAdmissions(admissions.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting admission:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const getPriorityCellClassName = (params) => {
    switch (params.value) {
      case 'HIGH': return styles.priorityHigh;
      case 'MEDIUM': return styles.priorityMedium;
      case 'LOW': return styles.priorityLow;
      default: return '';
    }
  };

  const getStatusCellClassName = (params) => {
    switch (params.value) {
      case 'ADMITTED': return styles.statusAdmitted;
      case 'DISCHARGED': return styles.statusDischarged;
      case 'PENDING': return styles.statusPending;
      default: return '';
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150, editable: true },
    { field: 'patientId', headerName: 'Patient ID', width: 120 },
    { field: 'wardName', headerName: 'Ward', width: 150, editable: true },
    { field: 'admissionDate', headerName: 'Admission Date', width: 150, editable: true },
    { field: 'doctorName', headerName: 'Doctor', width: 150, editable: true },
    {
      field: 'triagePriority',
      headerName: 'Triage Priority',
      width: 120,
      cellClassName: getPriorityCellClassName,
      editable: true,
    },
    { field: 'presentingComplaints', headerName: 'Presenting Complaints', width: 200, editable: true },
    { field: 'relayedInfo', headerName: 'Relayed Info', width: 200, editable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellClassName: getStatusCellClassName,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            onClick={() => onSelectAdmission(params.row.rawData)}
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
        Admissions
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load admissions: {error}
        </Alert>
      )}
      {admissions.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No admissions found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={admissions}
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