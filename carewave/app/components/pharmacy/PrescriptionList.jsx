'use client';
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function PrescriptionList({ prescriptions = [], loading, onPrescriptionDeleted }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await fetch(`/api/pharmacy/prescriptions?id=${selectedPrescription}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

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
      renderCell: (params) => 
        params.row.prescribedAt ? 
        format(new Date(params.row.prescribedAt), 'PPp') : 
        'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box className="flex gap-2">
          <Link href={`/prescriptions/${params.row.id}/edit`}>
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

  return (
    <div className="card w-full max-w-7xl mx-auto">
      <div style={{ height: 600, width: '100%' }} className="overflow-x-auto custom-scrollbar">
        <DataGrid
          rows={loading ? [] : prescriptions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          disableSelectionOnClick
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
              color: 'var(--hospital-gray-900)',
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
          components={{
            NoRowsOverlay: () => (
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