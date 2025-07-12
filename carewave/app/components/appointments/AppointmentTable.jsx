'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Edit, Trash2, MoreHorizontal, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppointmentTable({ appointments, loading }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/appointments?id=${selectedAppointment}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to delete appointment');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" className="badge-warning" icon={<Clock size={14} />} />;
      case 'CONFIRMED':
        return <Chip label="Confirmed" className="badge-success" icon={<CheckCircle size={14} />} />;
      case 'CANCELLED':
        return <Chip label="Cancelled" className="badge-error" icon={<XCircle size={14} />} />;
      case 'COMPLETED':
        return <Chip label="Completed" className="badge-info" icon={<Calendar size={14} />} />;
      default:
        return <Chip label={status} className="badge-neutral" />;
    }
  };

  return (
    <div className="card">
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Visit Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}><div className="loading-spinner mx-auto"></div></TableCell>
            </TableRow>
          ) : appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>No appointments found</TableCell>
            </TableRow>
          ) : (
            appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.patient?.name || 'N/A'}</TableCell>
                <TableCell>Dr. {appt.doctor?.name || 'N/A'}</TableCell>
                <TableCell>{appt.doctor?.department?.name || 'N/A'}</TableCell>
                <TableCell>{appt.visitType?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(appt.appointmentDate).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(appt.appointmentStatus)}</TableCell>
                <TableCell>
                  <Box className="flex gap-1">
                    <Link href={`/appointments/${appt.id}/edit`}>
                      <IconButton className="btn-outline">
                        <Edit size={16} />
                      </IconButton>
                    </Link>
                    <IconButton 
                      className="btn-outline" 
                      onClick={(e) => handleMenuClick(e, appt.id)}
                    >
                      <MoreHorizontal size={16} />
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
        <MenuItem onClick={handleDelete} className="dropdown-item">
          <Trash2 size={14} className="mr-1" /> Delete
        </MenuItem>
        <MenuItem 
          onClick={() => {
            router.push(`/appointments/${selectedAppointment}/history`);
            handleMenuClose();
          }}
          className="dropdown-item"
        >
          <Clock size={14} className="mr-1" /> View Status History
        </MenuItem>
      </Menu>
    </div>
  );
}