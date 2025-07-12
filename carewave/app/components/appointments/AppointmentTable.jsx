'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton, Menu, MenuItem, Box } from '@mui/material';
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

  return (
    <div className="card max-w-full mx-auto">
      <Table className="table w-full">
        <TableHead>
          <TableRow>
            <TableCell className="font-semibold">Patient</TableCell>
            <TableCell className="font-semibold">Doctor</TableCell>
            <TableCell className="font-semibold">Department</TableCell>
            <TableCell className="font-semibold">Visit Type</TableCell>
            <TableCell className="font-semibold">Date</TableCell>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell className="font-semibold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="loading-spinner mx-auto"></div>
              </TableCell>
            </TableRow>
          ) : !appointments || appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-[var(--hospital-gray-500)]">
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appt) => (
              <TableRow key={appt.id} className="hover:bg-[var(--hospital-gray-50)]">
                <TableCell>{appt.patient?.name || 'N/A'}</TableCell>
                <TableCell>
                  {appt.doctor?.name ? `Dr. ${appt.doctor.name}` : 'N/A'}
                </TableCell>
                <TableCell>{appt.doctor?.department?.name || 'N/A'}</TableCell>
                <TableCell>{appt.visitType?.name || 'N/A'}</TableCell>
                <TableCell>{formatDate(appt.appointmentDate)}</TableCell>
                <TableCell>{getStatusBadge(appt.appointmentStatus)}</TableCell>
                <TableCell>
                  <Box className="flex gap-2">
                    <Link href={`/appointments/${appt.id}/edit`}>
                      <IconButton className="btn-outline" size="small">
                        <Edit className="h-4 w-4" />
                      </IconButton>
                    </Link>
                    <IconButton 
                      className="btn-outline" 
                      size="small"
                      onClick={(e) => handleMenuClick(e, appt.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
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