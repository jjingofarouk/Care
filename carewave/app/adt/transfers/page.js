// app/adt/transfers/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ArrowLeftRight } from 'lucide-react';
import adtService from '../../services/adtService';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const data = await adtService.getTransfers();
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const columns = [
    { field: 'patientName', headerName: 'Patient', flex: 1, valueGetter: (params) => params.row.patient.name },
    { field: 'fromWard', headerName: 'From Ward', flex: 1, valueGetter: (params) => params.row.fromWard.name },
    { field: 'toWard', headerName: 'To Ward', flex: 1, valueGetter: (params) => params.row.toWard.name },
    {
      field: 'transferDate',
      headerName: 'Transfer Date',
      flex: 1,
      valueGetter: (params) => new Date(params.row.transferDate).toLocaleDateString(),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <ArrowLeftRight size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Transfers
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transfer History
          </Typography>
          <DataGrid
            rows={transfers}
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