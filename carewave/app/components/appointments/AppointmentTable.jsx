'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Edit, Trash2, MoreHorizontal, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteAppointment } from '@/services/appointmentService';

export default function AppointmentTable({ appointments }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleDelete = async () => {
    if (selectedAppointment) {
      await deleteAppointment(selectedAppointment);
      handleMenuClose();
      router.refresh();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" className="badge-warning" icon={<Clock size={16} />} />;
      case 'CONFIRMED':
        return <Chip label="Confirmed" className="badge-success" icon={<CheckCircle size={16} />} />;
      case 'CANCELLED':
        return <Chip label="Cancelled" className="badge-error" icon={<XCircle size={16} />} />;
      case 'COMPLETED':
        return <Chip label="Completed" className="badge-info" icon={<Calendar size={16} />} />;
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
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell>{appt.patient?.name || 'N/A'}</TableCell>
              <TableCell>Dr. {appt.doctor?.name || 'N/A'}</TableCell>
              <TableCell>{appt.doctor?.department?.name || 'N/A'}</TableCell>
              <TableCell>{appt.visitType?.name || 'N/A'}</TableCell>
              <TableCell>{new Date(appt.appointmentDate).toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(appt.appointmentStatus)}</TableCell>
              <TableCell>
                <Box className="flex gap-2">
                  <Link href={`/appointments/${appt.id}/edit`}>
                    <IconButton className="btn-outline">
                      <Edit size={20} />
                    </IconButton>
                  </Link>
                  <IconButton 
                    className="btn-outline" 
                    onClick={(e) => handleMenuClick(e, appt.id)}
                  >
                    <MoreHorizontal size={20} />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="dropdown-menu"
      >
        <MenuItem onClick={handleDelete} className="dropdown-item">
          <Trash2 size={16} className="mr-2" /> Delete
        </MenuItem>
        <MenuItem 
          onClick={() => {
            router.push(`/appointments/${selectedAppointment}/history`);
            handleMenuClose();
          }}
          className="dropdown-item"
        >
          <Clock size={16} className="mr-2" /> View Status History
        </MenuItem>
      </Menu>
    </div>
  );
}