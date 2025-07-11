"use client";

// app/components/patients/PatientList.js
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
      const response = await fetch(`/api/patients?search=${search}&include=addresses,nextOfKin,insuranceInfo`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await fetch(`/api/patients/${id}`, { method: 'DELETE' });
        fetchPatients();
      } catch (error) {
        console.error('Failed to delete patient:', error);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'age', 
      headerName: 'Age', 
      width: 100,
      valueGetter: (params) => {
        const dob = new Date(params.row.dateOfBirth);
        const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
        return age;
      }
    },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { 
      field: 'address', 
      headerName: 'Address', 
      width: 200,
      valueGetter: (params) => params.row.addresses?.[0]?.city || '-'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => router.push(`/patients/edit/${params.row.id}`)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="card-title">Patients</Typography>
        <Button 
          className="btn btn-primary"
          startIcon={<Add />}
          onClick={() => router.push('/patient/new')}
        >
          New Patient
        </Button>
      </Box>
      <Box className="flex gap-4 mb-6">
        <TextField
          className="input"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search className="mr-2" />,
          }}
        />
      </Box>
      <Box className="card">
        {loading ? (
          <Box className="flex justify-center p-8">
            <CircularProgress className="loading-spinner" />
          </Box>
        ) : (
          <DataGrid
            rows={patients}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            autoHeight
            className="table"
          />
        )}
      </Box>
    </Box>
  );
}