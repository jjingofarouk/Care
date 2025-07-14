// app/adt/discharges/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Bed } from 'lucide-react';
import adtService from '../../services/adtService';

export default function DischargesPage() {
  const [discharges, setDischarges] = useState([]);

  useEffect(() => {
    fetchDischarges();
  }, []);

  const fetchDischarges = async () => {
    try {
      const data = await adtService.getDischarges();
      setDischarges(data);
    } catch (error) {
      console.error('Error fetching discharges:', error);
    }
  };

  const columns = [
    { field: 'patientName', headerName: 'Patient', flex: 1, valueGetter: (params) => params.row.patient.name },
    { field: 'wardName', headerName: 'Ward', flex: 1, valueGetter: (params) => params.row.ward.name },
    {
      field: 'dischargeDate',
      headerName: 'Discharge Date',
      flex: 1,
      valueGetter: (params) => new Date(params.row.dischargeDate).toLocaleDateString(),
    },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <Bed size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Discharges
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Discharge History
          </Typography>
          <DataGrid
            rows={discharges}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            autoHeight
          />
        </CardContent>
      </Card>
    </Box>
  );
}