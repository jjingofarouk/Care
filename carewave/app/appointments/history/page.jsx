'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Chip, Box } from '@mui/material';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

export default function AppointmentHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments?resource=history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch appointment history');
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
      field: 'appointmentId',
      headerName: 'Appointment ID',
      width: 150,
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
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
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => getStatusBadge(params.row.status),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'changedAt',
      headerName: 'Changed At',
      width: 180,
      renderCell: (params) => formatDate(params.row.changedAt),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'changedBy',
      headerName: 'Changed By',
      width: 200,
      renderCell: (params) => params.row.changedBy?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
  ];

  return (
    <div className="max-w-full mx-auto p-2 sm:p-4">
      <Typography variant="h4" className="text-[var(--hospital-gray-900)] font-bold mb-2">
        Appointment Status History
      </Typography>
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      <div className="card w-full max-w-7xl mx-auto">
        <div style={{ height: 600, width: '100%' }} className="overflow-x-auto custom-scrollbar">
          <DataGrid
            rows={loading ? [] : history}
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
                    'No history records found'
                  )}
                </Box>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}