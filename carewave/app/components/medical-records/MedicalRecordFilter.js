'use client';
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { Search, X } from 'lucide-react';

const MedicalRecordFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    patientId: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onFilterChange(filters);
  };

  const handleClear = () => {
    setFilters({ patientId: '', dateFrom: '', dateTo: '' });
    onFilterChange({ patientId: '', dateFrom: '', dateTo: '' });
  };

  return (
    <Box className="card mb-4 p-4 w-full">
      <div className="flex flex-wrap gap-4">
        <TextField
          label="Patient ID"
          name="patientId"
          value={filters.patientId}
          onChange={handleChange}
          className="input flex-1 min-w-[200px]"
        />
        <TextField
          label="Date From"
          name="dateFrom"
          type="date"
          value={filters.dateFrom}
          onChange={handleChange}
          className="input flex-1 min-w-[200px]"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date To"
          name="dateTo"
          type="date"
          value={filters.dateTo}
          onChange={handleChange}
          className="input flex-1 min-w-[200px]"
          InputLabelProps={{ shrink: true }}
        />
        <div className="flex gap-2">
          <Button
            variant="contained"
            className="btn-primary"
            onClick={handleSubmit}
            startIcon={<Search />}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            className="btn-outline"
            onClick={handleClear}
            startIcon={<X />}
          >
            Clear
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default MedicalRecordFilter;