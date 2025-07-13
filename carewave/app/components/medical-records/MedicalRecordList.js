'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, IconButton, Typography, Alert } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

export default function MedicalRecordList() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [searchQuery]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/medical-records?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        console.error('Expected array but got:', data);
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError(error.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this medical record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/medical-records/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.status}`);
      }
      
      // Remove the deleted record from the state
      setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting medical record:', error);
      alert('Failed to delete medical record: ' + error.message);
    }
  };

  const handleView = (id) => {
    router.push(`/medical-records/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/medical-records/${id}/edit`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getChiefComplaint = (record) => {
    if (!record?.chiefComplaints || !Array.isArray(record.chiefComplaints)) {
      return 'N/A';
    }
    
    const firstComplaint = record.chiefComplaints[0];
    return firstComplaint?.description || 'N/A';
  };

  const getPatientName = (record) => {
    if (!record?.patient) return 'N/A';
    
    // Check if already formatted name exists
    if (record.patient.name) {
      return record.patient.name;
    }
    
    // Fallback to firstName and lastName
    const firstName = record.patient.firstName || '';
    const lastName = record.patient.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };

  const getDoctorName = (record) => {
    if (!record?.doctor) return 'N/A';
    
    // Check if already formatted name exists
    if (record.doctor.name) {
      return record.doctor.name;
    }
    
    // Fallback to firstName and lastName
    const firstName = record.doctor.firstName || '';
    const lastName = record.doctor.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'Record ID', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value || 'N/A'}
        </Typography>
      )
    },
    { 
      field: 'patientName', 
      headerName: 'Patient Name', 
      width: 200,
      valueGetter: (params) => getPatientName(params.row),
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'doctorName', 
      headerName: 'Doctor', 
      width: 180,
      valueGetter: (params) => getDoctorName(params.row),
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'recordDate', 
      headerName: 'Record Date', 
      width: 130,
      valueGetter: (params) => formatDate(params.row.recordDate),
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'chiefComplaint', 
      headerName: 'Chief Complaint', 
      width: 250,
      valueGetter: (params) => getChiefComplaint(params.row),
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        if (!params.row?.id) return null;
        
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => handleView(params.row.id)}
              title="View Record"
            >
              <Visibility />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleEdit(params.row.id)}
              title="Edit Record"
            >
              <Edit />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDelete(params.row.id)}
              title="Delete Record"
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical Records
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading medical records: {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search by patient name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
            placeholder="Enter patient name..."
          />
          <Button 
            variant="contained" 
            onClick={() => router.push('/medical-records/new')}
            sx={{ ml: 2 }}
          >
            New Medical Record
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={records}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  {searchQuery ? 'No records found matching your search' : 'No medical records found'}
                </Typography>
              </Box>
            ),
          }}
        />
      </Box>
      
      {records.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total records: {records.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
}