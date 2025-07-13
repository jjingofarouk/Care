import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function MedicalRecordFilter({ onFilterChange, showDateRange = true }) {
  const [filters, setFilters] = useState({
    patientId: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      patientId: '',
      dateFrom: '',
      dateTo: ''
    });
    onFilterChange({
      patientId: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 4 }}>
      <TextField
        name="patientId"
        label="Patient ID"
        value={filters.patientId}
        onChange={handleChange}
        size="small"
      />
      {showDateRange && (
        <>
          <TextField
            name="dateFrom"
            label="Date From"
            type="date"
            value={filters.dateFrom}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="dateTo"
            label="Date To"
            type="date"
            value={filters.dateTo}
            onChange={handleChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}
      <Button type="submit" variant="contained">Filter</Button>
      <Button variant="outlined" onClick={handleReset}>Reset</Button>
    </Box>
  );
}