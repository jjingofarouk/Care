'use client';
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Edit, Trash2, MoreHorizontal, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppointmentTable({ appointments, loading, onAppointmentDeleted }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/appointments?id=${selectedAppointment}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete appointment');
      }

      if (onAppointmentDeleted) {
        onAppointmentDeleted(selectedAppointment);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Failed to delete appointment: ' + err.message);
    } finally {
      setDeleteLoading(false);
      handleMenuClose();
    }
  };

  const handleViewHistory = () => {
    if (selectedAppointment) {
      router.push(`/appointments/${selectedAppointment}/history`);
      handleMenuClose();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" className="badge-warning" icon={<Clock className="h-4 w-4" />} />;
      case 'CONFIRMED':
        return <Chip label="Confirmed" className="badge-success" icon={<CheckCircle className="h-4 w-4" />} />;
      case 'CANCELLED':
        return <Chip label="Cancelled" className="badge-error" icon={<XCircle className="h-4 w-4" />} />;
      case 'COMPLETED':
        return <Chip label="Completed" className="badge-info" icon={<Calendar className="h-4 w-4" />} />;
      default:
        return <Chip label={status} className="badge-neutral" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const columns = [
    { 
      field: 'patient', 
      headerName: 'Patient', 
      width: 200,
      renderCell: (params) => params.row.patient?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    { 
      field: 'doctor', 
      headerName: 'Doctor', 
      width: 200,
      renderCell: (params) => params.row.doctor?.name ? `Dr. ${params.row.doctor.name}` : 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    { 
      field: 'department', 
      headerName: 'Department', 
      width: 180,
      renderCell: (params) => params.row.doctor?.department?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    { 
      field: 'visitType', 
      headerName: 'Visit Type', 
      width: 150,
      renderCell: (params) => params.row.visitType?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    { 
      field: 'appointmentDate', 
      headerName: 'Date', 
      width: 180,
      renderCell: (params) => formatDate(params.row.appointmentDate),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    { 
      field: 'appointmentStatus', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => getStatusBadge(params.row.appointmentStatus),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 120,
      renderCell: (params) => (
        <Box className="flex gap-2">
          <Link href={`/appointments/${params.row.id}/edit`}>
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
          rows={loading ? [] : appointments}
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
                  'No appointments found'
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
        <MenuItem 
          onClick={handleViewHistory}
          className="dropdown-item"
        >
          <Clock className="h-4 w-4 mr-2" /> View Status History
        </MenuItem>
      </Menu>
    </div>
  );
}