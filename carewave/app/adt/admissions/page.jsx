// app/adt/admissions/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Hospital } from 'lucide-react';
import AdmissionForm from '../../components/adt/AdmissionForm';
import DischargeForm from '../../components/adt/DischargeForm';
import TransferForm from '../../components/adt/TransferForm';
import BedStatus from '../../components/adt/BedStatus';
import adtService from '../../services/adtService';

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [openAdmissionForm, setOpenAdmissionForm] = useState(false);
  const [openDischargeForm, setOpenDischargeForm] = useState(false);
  const [openTransferForm, setOpenTransferForm] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const data = await adtService.getAdmissions();
      setAdmissions(data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  const columns = [
    { field: 'patientName', headerName: 'Patient', flex: 1, valueGetter: (params) => params.row.patient.name },
    { field: 'wardName', headerName: 'Ward', flex: 1, valueGetter: (params) => params.row.ward.name },
    { field: 'bedNumber', headerName: 'Bed', flex: 1, valueGetter: (params) => params.row.bed?.bedNumber || 'N/A' },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      flex: 1,
      valueGetter: (params) => new Date(params.row.admissionDate).toLocaleDateString(),
    },
    {
      field: 'emergency',
      headerName: 'Emergency',
      flex: 1,
      valueGetter: (params) => params.row.emergencyCases.length > 0 ? params.row.emergencyCases[0].triage.triageLevel : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenAdmissionForm(true);
            }}
            sx={{ mr: 1 }}
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
            sx={{ mr: 1 }}
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
        </>
      ),
    },
  ];

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
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Admissions
          </Typography>
          <DataGrid
            rows={admissions}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            autoHeight
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