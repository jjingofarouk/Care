// app/adt/transfers/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ArrowLeftRight } from 'lucide-react';
import adtService from '../../services/adtService';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adtService.getTransfers();
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setError('Failed to load transfers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      field: 'patientName', 
      headerName: 'Patient', 
      flex: 1,
      valueGetter: (value, row) => {
        // Handle different possible data structures
        if (row.patient?.name) return row.patient.name;
        if (row.patient?.firstName && row.patient?.lastName) {
          return `${row.patient.firstName} ${row.patient.lastName}`;
        }
        if (row.admission?.patient?.name) return row.admission.patient.name;
        if (row.admission?.patient?.firstName && row.admission?.patient?.lastName) {
          return `${row.admission.patient.firstName} ${row.admission.patient.lastName}`;
        }
        return 'N/A';
      }
    },
    { 
      field: 'fromWard', 
      headerName: 'From Ward', 
      flex: 1,
      valueGetter: (value, row) => {
        if (row.fromWard?.name) return row.fromWard.name;
        if (row.admission?.ward?.name) return row.admission.ward.name;
        return 'N/A';
      }
    },
    { 
      field: 'toWard', 
      headerName: 'To Ward', 
      flex: 1,
      valueGetter: (value, row) => {
        if (row.toWard?.name) return row.toWard.name;
        if (row.ward?.name) return row.ward.name;
        return 'N/A';
      }
    },
    {
      field: 'transferDate',
      headerName: 'Transfer Date',
      flex: 1,
      valueGetter: (value, row) => {
        if (!row.transferDate) return 'N/A';
        return new Date(row.transferDate).toLocaleDateString();
      }
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1,
      valueGetter: (value, row) => row.reason || row.transferReason || 'N/A'
    },
    {
      field: 'fromBed',
      headerName: 'From Bed',
      flex: 0.8,
      valueGetter: (value, row) => {
        if (row.fromBed?.bedNumber) return row.fromBed.bedNumber;
        if (row.admission?.bed?.bedNumber) return row.admission.bed.bedNumber;
        return 'N/A';
      }
    },
    {
      field: 'toBed',
      headerName: 'To Bed',
      flex: 0.8,
      valueGetter: (value, row) => {
        if (row.toBed?.bedNumber) return row.toBed.bedNumber;
        if (row.bed?.bedNumber) return row.bed.bedNumber;
        return 'N/A';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      valueGetter: (value, row) => row.status || 'Completed'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <ArrowLeftRight size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Transfers
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transfer History
          </Typography>
          <DataGrid
            rows={transfers}
            columns={columns}
            getRowId={(row) => row.id || `${row.admissionId}-${row.transferDate}`}
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
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}