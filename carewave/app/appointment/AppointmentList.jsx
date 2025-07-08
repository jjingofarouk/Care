"use client";

import React, { useState, useEffect } from 'react';
import { Box, Alert, Button, Skeleton, TextField, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AppointmentFilter from './AppointmentFilter';
import axios from 'axios';
import api from '../api';

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'ALL', dateFrom: '', dateTo: '', doctorId: '', patientId: '', type: 'ALL' });
  const [editingCell, setEditingCell] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [appointmentsData, patientsData, doctorsData] = await Promise.all([
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.PATIENT}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.DOCTOR}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setAppointments(appointmentsData.data.map(appt => ({
          id: appt.id,
          patientId: appt.patientId,
          patientName: appt.patient?.user?.name || 'N/A',
          doctorId: appt.doctorId,
          doctorName: appt.doctor?.user?.name || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
          type: appt.type || 'N/A',
          status: appt.status || 'N/A',
          reason: appt.reason || 'N/A',
          queueNumber: appt.queue?.queueNumber || 'N/A',
          checkInTime: appt.checkInTime ? new Date(appt.checkInTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : null,
          checkOutTime: appt.checkOutTime ? new Date(appt.checkOutTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : null,
        })));
        setPatients(patientsData.data);
        setDoctors(doctorsData.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, { resource: 'appointment', status: 'CANCELLED' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CANCELLED' } : appt
      ));
      setError(null);
    } catch (err) {
      setError('Failed to cancel appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const checkInTime = new Date();
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, { resource: 'appointment', status: 'CHECKED_IN', checkInTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CHECKED_IN', checkInTime: checkInTime.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) } : appt
      ));
      setError(null);
    } catch (err) {
      setError('Failed to check in appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const checkOutTime = new Date();
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, { resource: 'appointment', status: 'CHECKED_OUT', checkOutTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CHECKED_OUT', checkOutTime: checkOutTime.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) } : appt
      ));
      setError(null);
    } catch (err) {
      setError('Failed to check out appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (row) => {
    onEdit(row);
  };

  const handleCellEditCommit = async (params) => {
    try {
      const token = localStorage.getItem('token');
      const { id, field, value } = params;
      let updatePayload = { resource: 'appointment', [field]: value };

      if (field === 'date') {
        updatePayload[field] = new Date(value).toISOString();
      } else if (field === 'patientId') {
        updatePayload[field] = parseInt(value);
      } else if (field === 'doctorId') {
        updatePayload[field] = parseInt(value);
      } else if (field === 'queueNumber') {
        updatePayload[field] = parseInt(value) || 'N/A';
      }

      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(appointments.map(appt =>
        appt.id === id ? {
          ...appt,
          [field]: field === 'date' ? new Date(value).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) :
                  field === 'patientId' ? { ...appt, patientId: parseInt(value), patientName: patients.find(p => p.id === parseInt(value))?.user?.name || 'N/A' } :
                  field === 'doctorId' ? { ...appt, doctorId: parseInt(value), doctorName: doctors.find(d => d.id === parseInt(value))?.user?.name || 'N/A' } :
                  value
        } : appt
      ));
      setError(null);
      setEditingCell(null);
    } catch (err) {
      setError('Failed to update appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (!appt || !appt.id) return false;
    const matchesStatus = filter.status === 'ALL' || appt.status === filter.status;
    const matchesDateFrom = !filter.dateFrom || new Date(appt.date) >= new Date(filter.dateFrom);
    const matchesDateTo = !filter.dateTo || new Date(appt.date) <= new Date(filter.dateTo);
    const matchesDoctor = !filter.doctorId || appt.doctorId === parseInt(filter.doctorId);
    const matchesPatient = !filter.patientId || appt.patientId === parseInt(filter.patientId);
    const matchesType = filter.type === 'ALL' || appt.type === filter.type;
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesDoctor && matchesPatient && matchesType;
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 80, align: 'center', headerAlign: 'center' },
    {
      field: 'patientId',
      headerName: 'Patient',
      width: 180,
      editable: true,
      renderCell: (params) => params.row.patientName,
      renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          fullWidth
        >
          {patients.map(patient => (
            <MenuItem key={patient.id} value={patient.id}>
              {patient.user?.name || patient.patientId || 'N/A'}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'doctorId',
      headerName: 'Doctor',
      width: 180,
      editable: true,
      renderCell: (params) => params.row.doctorName,
      renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          fullWidth
        >
          {doctors.map(doctor => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.user?.name || doctor.doctorId || 'N/A'}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 160,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          type="datetime-local"
          value={params.value ? new Date(params.value).toISOString().slice(0, 16) : ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          fullWidth
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          fullWidth
        >
          <MenuItem value="CONSULTATION">Consultation</MenuItem>
          <MenuItem value="FOLLOW_UP">Follow Up</MenuItem>
          <MenuItem value="PROCEDURE">Procedure</MenuItem>
        </Select>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box className={`status ${params.value.toLowerCase()}`}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'reason',
      headerName: 'Reason',
      width: 140,
      editable: true,
    },
    {
      field: 'queueNumber',
      headerName: 'Queue',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box className="actionContainer">
          <Button
            onClick={() => handleEdit(params.row)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
            className="actionButton editButton"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleCancel(params.row.id)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
            className="actionButton cancelButton"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleCheckIn(params.row.id)}
            disabled={params.row.status !== 'SCHEDULED'}
            className="actionButton checkInButton"
          >
            Check In
          </Button>
          <Button
            onClick={() => handleCheckOut(params.row.id)}
            disabled={params.row.status !== 'CHECKED_IN'}
            className="actionButton checkOutButton"
          >
            Check Out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <div className="bg-hospital-gray-50 dark:bg-hospital-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Appointments</h2>
        <AppointmentFilter onFilter={setFilter} patients={patients} doctors={doctors} />
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </div>
        ) : (
          <>
            {filteredAppointments.length === 0 && !error && (
              <Alert severity="info" className="mb-4">
                No appointments found
              </Alert>
            )}
            <div className="mt-4">
              <DataGrid
                rows={filteredAppointments}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white"
                autoHeight
onCellEditStart={(params) => setEditingCell({ id: params.id, field: params.field })}
                onCellEditStop={() => setEditingCell(null)}
                onCellEditCommit={handleCellEditCommit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}