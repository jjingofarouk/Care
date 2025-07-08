"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, InputLabel, Select, MenuItem, Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './DoctorAvailability.module.css';

export default function DoctorAvailability({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [formData, setFormData] = useState({ startTime: '', endTime: '', status: 'AVAILABLE' });
  const [availability, setAvailability] = useState([]);
  const [filteredAvailability, setFilteredAvailability] = useState([]);
  const [filter, setFilter] = useState({ status: '', date: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllAvailability() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const allAvailability = [];
        
        for (const doctor of doctors || []) {
          try {
            const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${doctor.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const doctorAvailability = response.data.map((item, index) => ({
              ...item,
              id: item.id || `${doctor.id}-${index + 1}`,
              doctorName: doctor.user?.name || doctor.doctorId || 'Unknown Doctor',
              specialty: doctor.specialty || 'N/A',
              doctorId: doctor.id,
            }));
            allAvailability.push(...doctorAvailability);
          } catch (doctorErr) {
            console.warn(`Failed to fetch availability for doctor ${doctor.id}:`, doctorErr.message);
          }
        }
        
        setAvailability(allAvailability);
        setFilteredAvailability(allAvailability);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (doctors && doctors.length > 0) {
      fetchAllAvailability();
    } else {
      setError('No doctors available to fetch availability data');
      setLoading(false);
    }
  }, [doctors]);

  useEffect(() => {
    applyFilters(availability, filter, selectedDoctorId);
  }, [filter, availability, selectedDoctorId]);

  const applyFilters = (data, currentFilter, doctorId) => {
    let filtered = [...data];
    
    if (doctorId) {
      filtered = filtered.filter(item => item.doctorId === parseInt(doctorId));
    }
    
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }
    
    if (currentFilter.date) {
      const filterDate = new Date(currentFilter.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.startTime).toDateString();
        return itemDate === filterDate;
      });
    }
    
    setFilteredAvailability(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError('Please select a doctor to add availability.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Start and End times are required.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`,
        { resource: 'availability', ...formData, doctorId: selectedDoctorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ startTime: '', endTime: '', status: 'AVAILABLE' });
      
      const newAvailability = {
        ...response.data,
        id: response.data.id || `${selectedDoctorId}-${availability.length + 1}`,
        doctorName: doctors.find(d => d.id === parseInt(selectedDoctorId))?.user?.name || 'Unknown Doctor',
        specialty: doctors.find(d => d.id === parseInt(selectedDoctorId))?.specialty || 'N/A',
        doctorId: parseInt(selectedDoctorId),
      };
      
      const updatedAvailability = [...availability, newAvailability];
      setAvailability(updatedAvailability);
      applyFilters(updatedAvailability, filter, selectedDoctorId);
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCellEditCommit = async (params) => {
    try {
      const token = localStorage.getItem('token');
      const { id, field, value } = params;
      let updatePayload = { resource: 'availability', [field]: value };

      if (field === 'startTime' || field === 'endTime') {
        updatePayload[field] = new Date(value).toISOString();
      } else if (field === 'doctorId') {
        updatePayload[field] = parseInt(value);
      }

      await axios.put(
        `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAvailability(availability.map(item =>
        item.id === id ? {
          ...item,
          [field]: field === 'startTime' || field === 'endTime' ? new Date(value).toISOString() :
                  field === 'doctorId' ? {
                    ...item,
                    doctorId: parseInt(value),
                    doctorName: doctors.find(d => d.id === parseInt(value))?.user?.name || 'Unknown Doctor',
                    specialty: doctors.find(d => d.id === parseInt(value))?.specialty || 'N/A'
                  } : value
        } : item
      ));
      applyFilters(availability, filter, selectedDoctorId);
      setError(null);
      setEditingCell(null);
    } catch (err) {
      setError('Failed to update availability: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const columns = [
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
    { field: 'specialty', headerName: 'Specialty', width: 150 },
    {
      field: 'startTime',
      headerName: 'Start Time',
      width: 200,
      editable: true,
      renderCell: (params) => (params.row.startTime ? new Date(params.row.startTime).toLocaleString() : 'N/A'),
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
      field: 'endTime',
      headerName: 'End Time',
      width: 200,
      editable: true,
      renderCell: (params) => (params.row.endTime ? new Date(params.row.endTime).toLocaleString() : 'N/A'),
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
      field: 'status',
      headerName: 'Status',
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          fullWidth
        >
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
        </Select>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" gutterBottom className={styles.title}>
        Doctor Availability
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} className={styles.form}>
        <SearchableSelect
          label="Select Doctor (Required for adding availability)"
          options={doctors || []}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          className={styles.input}
        />
        <TextField
          label="Start Time"
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          className={styles.input}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          className={styles.input}
        />
        <FormControl className={styles.input}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          >
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" className={styles.button}>
          Add Availability
        </Button>
      </Box>

      <Box className={styles.filterContainer}>
        <FormControl className={styles.filterInput}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
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
            rows={filteredAvailability}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            onCellEditStart={(params) => setEditingCell({ id: params.id, field: params.field })}
            onCellEditStop={() => setEditingCell(null)}
            onCellEditCommit={handleCellEditCommit}
          />
        )}
      </Box>
    </Box>
  );
}