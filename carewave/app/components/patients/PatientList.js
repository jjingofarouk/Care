// components/patients/PatientList.js
"use client";

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(search)}&include=addresses,nextOfKin,insuranceInfo`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data.map(patient => ({
        ...patient,
        id: patient.id,
      })));
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete patient');
        fetchPatients();
      } catch (error) {
        console.error('Failed to delete patient:', error);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 120, flex: 0.5 },
    { field: 'firstName', headerName: 'First Name', width: 150, flex: 1 },
    { field: 'lastName', headerName: 'Last Name', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 200, flex: 1.5 },
    {
      field: 'age',
      headerName: 'Age',
      width: 100,
      flex: 0.5,
      valueGetter: ({ row }) => {
        const dob = new Date(row.dateOfBirth);
        return Math.floor((Date.now() - dob) / (365.25 * 24 * 60 * 60 * 1000));
      },
    },
    { field: 'gender', headerName: 'Gender', width: 100, flex: 0.5 },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      flex: 1.5,
      valueGetter: ({ row }) => {
        const addr = row.addresses?.[0];
        return addr ? `${addr.street}, ${addr.city}, ${addr.country}` : '-';
      },
    },
    {
      field: 'nextOfKin',
      headerName: 'Next of Kin',
      width: 150,
      flex: 1,
      valueGetter: ({ row }) => (row.nextOfKin ? `${row.nextOfKin.firstName} ${row.nextOfKin.lastName}` : '-'),
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      width: 150,
      flex: 1,
      valueGetter: ({ row }) => (row.insuranceInfo ? row.insuranceInfo.provider : '-'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color="primary"
            onClick={() => router.push(`/patients/edit/${row.id}`)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(row.id)}
            size="small"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '100%', overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Patients
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/patients/new')}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          New Patient
        </Button>
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={patients}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': { py: 1 },
              '& .MuiDataGrid-columnHeaders': { bgcolor: 'grey.100' },
              '& .MuiDataGrid-row:hover': { bgcolor: 'grey.50' },
            }}
          />
        )}
      </Box>
    </Box>
  );
}