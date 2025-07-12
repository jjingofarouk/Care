"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, TextField, Button, Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import api from '../api';

export default function AvailableDoctorsList() {
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctorsData = await Promise.all(
          response.data.map(async (doctor) => {
            const availabilityResponse = await axios.get(
              `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${doctor.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const availableSlots = (availabilityResponse.data || []).filter(
              (item) => item?.startTime && item?.endTime && item.status === 'AVAILABLE'
            );
            return {
              id: doctor.id || `doctor-${Math.random()}`,
              name: doctor.user?.name || doctor.doctorId || 'N/A',
              specialty: doctor.specialty || 'N/A',
              availability: availableSlots,
            };
          })
        );
        setDoctors(doctorsData.filter(doctor => doctor.availability.length > 0));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const handleDateChange = (e) => {
    setDateFilter({ ...dateFilter, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      setError('Please select a date range');
      return;
    }
    if (new Date(dateFilter.startDate) > new Date(dateFilter.endDate)) {
      setError('End date must be after start date');
      return;
    }
    setError(null);
  };

  const filteredDoctors = doctors.map((doctor) => ({
    ...doctor,
    availability: dateFilter.startDate && dateFilter.endDate
      ? doctor.availability.filter(
          (slot) =>
            slot.startTime &&
            slot.endTime &&
            new Date(slot.startTime) >= new Date(dateFilter.startDate) &&
            new Date(slot.endTime) <= new Date(dateFilter.endDate)
        )
      : doctor.availability,
  })).filter(doctor => doctor.availability.length > 0);

  const columns = [
    { field: 'name', headerName: 'Doctor Name', width: 200 },
    { field: 'specialty', headerName: 'Specialty', width: 150 },
    {
      field: 'availableSlots',
      headerName: 'Available Time Slots',
      width: 400,
      renderCell: (params) => {
        const slots = params.row?.availability || [];
        return slots.length > 0
          ? slots
              .map((slot) => `${new Date(slot.startTime).toLocaleString()} - ${new Date(slot.endTime).toLocaleString()}`)
              .join(', ')
          : 'No available slots';
      },
    },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
        Available Doctors
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={dateFilter.startDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={dateFilter.endDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <Button onClick={handleFilter} variant="contained" sx={{ bgcolor: '#1976d2' }}>
          Filter
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      ) : (
        <Box sx={{ height: 400, width: '100%', bgcolor: 'white', borderRadius: 2 }}>
          <DataGrid
            rows={filteredDoctors}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </Box>
  );
}