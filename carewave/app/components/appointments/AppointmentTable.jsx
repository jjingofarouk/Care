'use client';
import React, { useState } from 'react';
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
      if (!token) throw new Error('No authentication token found');

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
        return (
          <span className="badge badge-warning">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge badge-success">
            <CheckCircle className="w-3 h-3 mr-1" /> Confirmed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-error">
            <XCircle className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge badge-info">
            <Calendar className="w-3 h-3 mr-1" /> Completed
          </span>
        );
      default:
        return <span className="badge badge-neutral">{status}</span>;
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
    <div className="card max-w-full">
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Department</th>
            <th>Visit Type</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-8">
                <div className="loading-spinner mx-auto"></div>
              </td>
            </tr>
          ) : !appointments || appointments.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8">
                No appointments found
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.patient?.name || 'N/A'}</td>
                <td>{appt.doctor?.name ? `Dr. ${appt.doctor.name}` : 'N/A'}</td>
                <td>{appt.doctor?.department?.name || 'N/A'}</td>
                <td>{appt.visitType?.name || 'N/A'}</td>
                <td>{formatDate(appt.appointmentDate)}</td>
                <td>{getStatusBadge(appt.appointmentStatus)}</td>
                <td>
                  <div className="flex gap-1">
                    <Link href={`/appointments/${appt.id}/edit`}>
                      <button className="btn btn-outline btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={(e) => handleMenuClick(e, appt.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div
        className={`dropdown-menu ${anchorEl ? 'block' : 'hidden'}`}
      >
        <button
          onClick={handleDelete}
          className="dropdown-item"
          disabled={deleteLoading}
        >
          <Trash2 className="w-3 h-3 mr-2" />
          {deleteLoading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={handleViewHistory}
          className="dropdown-item"
        >
          <Clock className="w-3 h-3 mr-2" />
          View Status History
        </button>
      </div>
    </div>
  );
}