'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function MedicalRecordList() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await fetch(`/api/medical-records?search=${searchQuery}&include=chiefComplaint`);
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    }
    fetchRecords();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this medical record?')) {
      try {
        const response = await fetch(`/api/medical-records/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setRecords(records.filter(record => record.id !== id));
        }
      } catch (error) {
        console.error('Error deleting medical record:', error);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'Record ID', width: 150 },
    { 
      field: 'patientName', 
      headerName: 'Patient Name', 
      width: 200,
      valueGetter: (params) => `${params.row.patient.firstName} ${params.row.patient.lastName}`
    },
    { 
      field: 'recordDate', 
      headerName: 'Record Date', 
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'chiefComplaint', 
      headerName: 'Chief Complaint', 
      width: 200,
      valueGetter: (params) => params.row.chiefComplaint?.description || 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => router.push(`/medical-records/${params.row.id}`)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search by patient name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button variant="contained" onClick={() => router.push('/medical-records/new')}>
          New Medical Record
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={records}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}