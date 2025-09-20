// app/adt/discharges/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Bed } from 'lucide-react';
import adtService from '../../services/adtService';

export default function DischargesPage() {
  const [discharges, setDischarges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDischarges();
  }, []);

  const fetchDischarges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adtService.getDischarges();
      setDischarges(data);
    } catch (error) {
      console.error('Error fetching discharges:', error);
      setError('Failed to load discharges. Please try again.');
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
      field: 'wardName', 
      headerName: 'Ward', 
      flex: 1,
      valueGetter: (value, row) => {
        if (row.ward?.name) return row.ward.name;
        if (row.admission?.ward?.name) return row.admission.ward.name;
        return 'N/A';
      }
    },
    {
      field: 'dischargeDate',
      headerName: 'Discharge Date',
      flex: 1,
      valueGetter: (value, row) => {
        if (!row.dischargeDate) return 'N/A';
        return new Date(row.dischargeDate).toLocaleDateString();
      }
    },
    { 
      field: 'notes', 
      headerName: 'Notes', 
      flex: 1,
      valueGetter: (value, row) => row.notes || row.dischargeNotes || 'N/A'
    },
    {
      field: 'dischargeType',
      headerName: 'Discharge Type',
      flex: 1,
      valueGetter: (value, row) => row.dischargeType || 'Standard'
    },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      flex: 1,
      valueGetter: (value, row) => {
        const admissionDate = row.admissionDate || row.admission?.admissionDate;
        if (!admissionDate) return 'N/A';
        return new Date(admissionDate).toLocaleDateString();
      }
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
        <Bed size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Discharges
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Discharge History
          </Typography>
          <DataGrid
            rows={discharges}
            columns={columns}
            getRowId={(row) => row.id || `${row.admissionId}-${row.dischargeDate}`}
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