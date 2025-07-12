import React from 'react';
import { getStatusHistory } from '@/services/appointmentService';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { Clock } from 'lucide-react';
import { Typography } from '@mui/material';

export default async function AppointmentHistoryPage({ params }) {
  const history = await getStatusHistory(params.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" className="badge-warning" icon={<Clock size={16} />} />;
      case 'CONFIRMED':
        return <Chip label="Confirmed" className="badge-success" icon={<Clock size={16} />} />;
      case 'CANCELLED':
        return <Chip label="Cancelled" className="badge-error" icon={<Clock size={16} />} />;
      case 'COMPLETED':
        return <Chip label="Completed" className="badge-info" icon={<Clock size={16} />} />;
      default:
        return <Chip label={status} className="badge-neutral" />;
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="text-[var(--hospital-gray-900)] mb-6">
        Appointment Status History
      </Typography>
      <div className="card">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Changed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell>{new Date(record.changedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}