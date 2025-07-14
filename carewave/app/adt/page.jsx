// app/adt/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Hospital } from 'lucide-react';
import AdmissionForm from '../components/adt/AdmissionForm';
import DischargeForm from '../components/adt/DischargeForm';
import TransferForm from '../components/adt/TransferForm';
import BedStatus from '../components/adt/BedStatus';
import adtService from '../services/adtService';

export default function AdtPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdmissionForm, setOpenAdmissionForm] = useState(false);
  const [openDischargeForm, setOpenDischargeForm] = useState(false);
  const [openTransferForm, setOpenTransferForm] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adtService.getAdmissions();
      setAdmissions(data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      setError('Failed to load admissions. Please try again.');
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
        return 'N/A';
      }
    },
    { 
      field: 'wardName', 
      headerName: 'Ward', 
      flex: 1,
      valueGetter: (value, row) => row.ward?.name || 'N/A'
    },
    { 
      field: 'bedNumber', 
      headerName: 'Bed', 
      flex: 1,
      valueGetter: (value, row) => row.bed?.bedNumber || 'N/A'
    },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      flex: 1,
      valueGetter: (value, row) => {
        if (!row.admissionDate) return 'N/A';
        return new Date(row.admissionDate).toLocaleDateString();
      }
    },
    {
      field: 'emergency',
      headerName: 'Emergency',
      flex: 1,
      valueGetter: (value, row) => {
        if (row.emergencyCases && row.emergencyCases.length > 0) {
          return row.emergencyCases[0].triage?.triageLevel || 'N/A';
        }
        return 'N/A';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenAdmissionForm(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenDischargeForm(true);
            }}
          >
            Discharge
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenTransferForm(true);
            }}
          >
            Transfer
          </Button>
        </Box>
      ),
    },
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
        <Hospital size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Admissions
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => {
          setSelectedAdmission(null);
          setOpenAdmissionForm(true);
        }}
        sx={{ mb: 2 }}
      >
        New Admission
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Admissions
          </Typography>
          <DataGrid
            rows={admissions}
            columns={columns}
            getRowId={(row) => row.id || `${row.patientId}-${row.admissionDate}`}
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

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bed Status
          </Typography>
          <BedStatus />
        </CardContent>
      </Card>

      <AdmissionForm
        open={openAdmissionForm}
        onClose={() => setOpenAdmissionForm(false)}
        admission={selectedAdmission}
        onSave={fetchAdmissions}
      />
      <DischargeForm
        open={openDischargeForm}
        onClose={() => setOpenDischargeForm(false)}
        admission={selectedAdmission}
        onSave={fetchAdmissions}
      />
      <TransferForm
        open={openTransferForm}
        onClose={() => setOpenTransferForm(false)}
        admission={selectedAdmission}
        onSave={fetchAdmissions}
      />
    </Box>
  );
}