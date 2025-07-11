'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box } from '@mui/material';
import { Filter, X } from 'lucide-react';

export default function AppointmentFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    status: '',
    doctorId: '',
    patientId: '',
    dateFrom: '',
    dateTo: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      status: '',
      doctorId: '',
      patientId: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="card p-4 mb-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <FormControl className="w-full sm:w-48">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="select"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="patientId"
          label="Patient ID"
          value={filters.patientId}
          onChange={handleChange}
          className="input w-full sm:w-48"
        />
        <TextField
          name="doctorId"
          label="Doctor ID"
          value={filters.doctorId}
          onChange={handleChange}
          className="input w-full sm:w-48"
        />
        <TextField
          name="dateFrom"
          type="date"
          label="From Date"
          value={filters.dateFrom}
          onChange={handleChange}
          className="input w-full sm:w-48"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="dateTo"
          type="date"
          label="To Date"
          value={filters.dateTo}
          onChange={handleChange}
          className="input w-full sm:w-48"
          InputLabelProps={{ shrink: true }}
        />
        <Box className="flex gap-2">
          <Button
            type="submit"
            variant="contained"
            className="btn-primary"
            startIcon={<Filter size={20} />}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            className="btn-secondary"
            onClick={handleClear}
            startIcon={<X size={20} />}
          >
            Clear
          </Button>
        </Box>
      </form>
    </div>
  );
}