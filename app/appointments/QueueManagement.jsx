"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Skeleton, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './Queue.module.css';

export default function QueueManagement({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queueItems, setQueueItems] = useState([]);
  const [filteredQueueItems, setFilteredQueueItems] = useState([]);
  const [filter, setFilter] = useState({ status: '', date: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllQueues() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const allQueueItems = [];

        for (const doctor of doctors || []) {
          try {
            const response = await axios.get(
              `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=queue&doctorId=${doctor.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const doctorQueueItems = (response.data || []).map((item, index) => ({
              id: item.id || `${doctor.id}-queue-${index + 1}`,
              patientName:
                item.appointment?.patient?.user?.name ||
                item.appointment?.patient?.patientId ||
                'N/A',
              doctorName: doctor.user?.name || doctor.doctorId || 'Unknown Doctor',
              doctorId: doctor.id,
              queueNumber: item.queueNumber || 'N/A',
              status: item.status || 'WAITING',
              appointmentDate: item.appointment?.date
                ? new Date(item.appointment.date).toLocaleString()
                : 'N/A',
            }));
            allQueueItems.push(...doctorQueueItems);
          } catch (doctorErr) {
            console.warn(`Failed to fetch queue for doctor ${doctor.id}:`, doctorErr.message);
          }
        }

        if (allQueueItems.length === 0) {
          setError('No queue items found for any doctors.');
        } else {
          setQueueItems(allQueueItems);
          applyFilters(allQueueItems, filter, selectedDoctorId);
          setError(null);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch queue data');
      } finally {
        setLoading(false);
      }
    }

    if (doctors && doctors.length > 0) {
      fetchAllQueues();
    } else {
      setError('No doctors available to fetch queue data');
      setLoading(false);
    }
  }, [doctors]);

  const applyFilters = (data, currentFilter, doctorId) => {
    let filtered = [...(data || [])];

    if (doctorId) {
      filtered = filtered.filter(item => item.doctorId === parseInt(doctorId));
    }

    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }

    if (currentFilter.date) {
      const filterDate = new Date(currentFilter.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.appointmentDate).toDateString();
        return itemDate === filterDate;
      });
    }

    setFilteredQueueItems(filtered);
  };

  useEffect(() => {
    applyFilters(queueItems, filter, selectedDoctorId);
  }, [filter, queueItems, selectedDoctorId]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.put(
        `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`,
        {
          resource: 'queue',
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedQueueItems = queueItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      );
      setQueueItems(updatedQueueItems);
      applyFilters(updatedQueueItems, filter, selectedDoctorId);
      setError(null);
    } catch (err) {
      setError('Failed to update queue status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
    { field: 'appointmentDate', headerName: 'Appointment Date', width: 200 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box className={styles.actions}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'IN_PROGRESS')}
            disabled={params.row.status !== 'WAITING'}
            className={styles.actionButton}
          >
            Start
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'COMPLETED')}
            disabled={params.row.status !== 'IN_PROGRESS'}
            className={styles.actionButton}
          >
            Complete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" gutterBottom className={styles.title}>
        Queue Management
      </Typography>
      <Box className={styles.filterContainer}>
        <SearchableSelect
          label="Filter by Doctor"
          options={doctors || []}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          className={styles.filterInput}
        />
        <TextField
          label="Filter by Date"
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          className={styles.filterInput}
        />
        <FormControl className={styles.filterInput}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="WAITING">Waiting</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      <Box className={styles.gridContainer}>
        {loading ? (
          <Box className={styles.loader}>
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </Box>
        ) : (
          <DataGrid
            rows={filteredQueueItems}
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