"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './DoctorSchedule.module.css';

export default function DoctorSchedule({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ patientName: '', type: '', date: '' });

  useEffect(() => {
    async function fetchAppointments(doctorId = '') {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = doctorId
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?doctorId=${doctorId}&status=SCHEDULED`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?status=SCHEDULED`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAppointments = response.data.map((appt, index) => ({
          id: appt.id || `appt-${index + 1}`,
          patientName: appt.patient?.user?.name || appt.patient?.patientId || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
          type: appt.type || 'N/A',
          reason: appt.reason || 'N/A',
          queueNumber: appt.queue?.queueNumber || 'N/A',
        }));
        setAppointments(formattedAppointments);
        setFilteredAppointments(formattedAppointments);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments(selectedDoctorId);
  }, [selectedDoctorId]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...appointments];
      if (filters.patientName) {
        filtered = filtered.filter(appt => appt.patientName.toLowerCase().includes(filters.patientName.toLowerCase()));
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
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Doctor Schedule
      </Typography>
      <Box className={styles.filterContainer}>
        <SearchableSelect
          label="Filter by Doctor"
          options={doctors}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          className={styles.searchSelect}
        />
        <TextField
          label="Filter by Patient"
          name="patientName"
          value={filters.patientName}
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