'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function PrescriptionList({ 
  prescriptions: initialPrescriptions = [], 
  loading: initialLoading = false, 
  onPrescriptionDeleted 
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialPrescriptions || initialPrescriptions.length === 0) {
      fetchPrescriptions();
    }
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/pharmacy/prescriptions', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrescriptions(data);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrescription(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPrescription(null);
  };

  const handleDelete = async () => {
    if (!selectedPrescription) return;

    setDeleteLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/prescriptions?id=${selectedPrescription}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      setPrescriptions(prev => prev.filter(p => p.id !== selectedPrescription));

      if (onPrescriptionDeleted) {
        onPrescriptionDeleted(selectedPrescription);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting prescription:', err);
      alert('Failed to delete prescription: ' + err.message);
    } finally {
      setDeleteLoading(false);
      handleMenuClose();
    }
  };

  const columns = [
    {
      field: 'patientName',
      headerName: 'Patient',
      width: 200,
      renderCell: (params) => params.row.patient?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'doctorName',
      headerName: 'Doctor',
      width: 200,
      renderCell: (params) => params.row.doctor?.name ? `Dr. ${params.row.doctor.name}` : 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'drugName',
      headerName: 'Drug',
      width: 150,
      renderCell: (params) => params.row.drug?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'dosage',
      headerName: 'Dosage',
      width: 150,
      renderCell: (params) => params.row.dosage || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'prescribedAt',
      headerName: 'Prescribed At',
      width: 180,
      renderCell: (params) => {
        try {
          return params.row.prescribedAt ? 
            format(new Date(params.row.prescribedAt), 'PPp') : 
            'N/A';
        } catch (error) {
          console.error('Date formatting error:', error);
          return 'Invalid Date';
        }
      },
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box className="flex gap-2">
          <Link href={`/pharmacy/prescriptions/new?id=${params.row.id}`}>
            <IconButton className="btn-outline" size="small">
              <Edit className="h-4 w-4" />
            </IconButton>
          </Link>
          <IconButton 
            className="btn-outline" 
            size="small"
            onClick={(e) => handleMenuClick(e, params.row.id)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </IconButton>
        </Box>
      ),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
  ];

  if (error) {
    return (
      <div className="card max-w-[1280px] mx-auto p-2">
        <div className="text-center">
          <div className="text-[var(--hospital-error)] mb-2">Error loading prescriptions</div>
          <div className="text-sm text-[var(--hospital-gray-600)]">{error}</div>
          <button 
            onClick={fetchPrescriptions}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-[1280px] mx-auto p-2">
      <div className="overflow-x-auto custom-scrollbar">
        <DataGrid
          rows={loading ? [] : prescriptions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          disableRowSelectionOnClick
          autoHeight={false}
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
              backgroundColor: 'var(--hospital-white)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-sm)',
            },
            '& .MuiDataGrid-cell': {
              borderTop: '1px solid var(--hospital-gray-200)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1.5rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--hospital-gray-50)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'var(--hospital-gray-50)',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'var(--hospital-gray-50)',
              borderTop: '1px solid var(--hospital-gray-200)',
            },
            '& .MuiDataGrid-overlay': {
              backgroundColor: 'var(--hospital-white)',
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box className="flex justify-center items-center h-full text-[var(--hospital-gray-500)]">
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'No prescriptions found'
                )}
              </Box>
            ),
          }}
        />
      </div>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="dropdown-menu"
      >
        <MenuItem 
          onClick={handleDelete} 
          className="dropdown-item"
          disabled={deleteLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" /> 
          {deleteLoading ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </Menu>
    </div>
  );
}