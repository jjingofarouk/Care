"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './AppointmentHistory.module.css';

export default function AppointmentHistory({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '', date: '' });

  useEffect(() => {
    const fetchAppointments = async (patientId = '') => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = patientId
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?patientId=${patientId}`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAppointments = response.data.map((appt, index) => ({
          id: appt.id || `appt-${index + 1}`,
          doctorName: appt.doctor?.user?.name || appt.doctor?.doctorId || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
          type: appt.type || 'N/A',
          status: appt.status || 'N/A',
          reason: appt.reason || 'N/A',
          notes: appt.notes || 'N/A',
        }));
        setAppointments(formattedAppointments);
        setFilteredAppointments(formattedAppointments);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments(selectedPatientId);
  }, [selectedPatientId]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...appointments];
      if (filters.status) {
        filtered = filtered.filter(appt => appt.status.toLowerCase().includes(filters.status.toLowerCase()));
      }
      if (filters.type) {
        filtered = filtered.filter(appt => appt.type.toLowerCase().includes(filters.type.toLowerCase()));
      }
      if (filters.date) {
        filtered = filtered.filter(appt => appt.date.includes(filters.date));
      }
      setFilteredAppointments(filtered);
    };
    applyFilters();
  }, [filters, appointments]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Appointment History
      </Typography>
      <Box className={styles.filterContainer}>
        <SearchableSelect
          label="Filter by Patient"
          options={patients}
          value={selectedPatientId}
          onChange={setSelectedPatientId}
          getOptionLabel={(patient) => patient.user?.name || patient.patientId || 'Unknown'}
          getOptionValue={(patient) => patient.id}
          className={styles.searchSelect}
        />
        <TextField
          label="Filter by Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
        <TextField
          label="Filter by Type"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
        <TextField
          label="Filter by Date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
      </Box>
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      <Box className={styles.dataGridContainer}>
        {loading ? (
          <CircularProgress className={styles.loader} />
        ) : (
          <DataGrid
            rows={filteredAppointments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            className={styles.dataGrid}
          />
        )}
      </Box>
    </Box>
  );
}