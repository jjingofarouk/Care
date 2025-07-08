import React, { useState } from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';

export default function AppointmentFilter({ onFilter, patients = [], doctors = [] }) {
  const [filters, setFilters] = useState({
    status: 'ALL',
    type: 'ALL',
    dateFrom: '',
    dateTo: '',
    doctorId: '',
    patientId: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={filters.status} onChange={handleChange}>
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="SCHEDULED">Scheduled</MenuItem>
          <MenuItem value="CHECKED_IN">Checked In</MenuItem>
          <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
          <MenuItem value="NO_SHOW">No Show</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select name="type" value={filters.type} onChange={handleChange}>
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="WALK_IN">Walk-In</MenuItem>
          <MenuItem value="EMERGENCY">Emergency</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="From Date"
        type="date"
        name="dateFrom"
        value={filters.dateFrom}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="To Date"
        type="date"
        name="dateTo"
        value={filters.dateTo}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Doctor</InputLabel>
        <Select name="doctorId" value={filters.doctorId} onChange={handleChange}>
          <MenuItem value="">All Doctors</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>{doctor.user.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Patient</InputLabel>
        <Select name="patientId" value={filters.patientId} onChange={handleChange}>
          <MenuItem value="">All Patients</MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>{patient.user.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained">Apply Filters</Button>
    </Box>
  );
}