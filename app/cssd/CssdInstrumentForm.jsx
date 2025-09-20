'use client';
import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Alert, Typography } from '@mui/material';
import { createInstrument } from './cssdService';
import styles from './CssdForm.module.css';

export default function CssdInstrumentForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    type: '',
    status: 'AVAILABLE',
    lastSterilized: '',
    location: '',
    stockQuantity: '1',
    minStockThreshold: '1',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const dataToSend = {
        ...formData,
        stockQuantity: parseInt(formData.stockQuantity),
        minStockThreshold: parseInt(formData.minStockThreshold),
        lastSterilized: formData.lastSterilized || null,
      };
      await createInstrument(dataToSend);
      setFormData({
        name: '',
        serialNumber: '',
        type: '',
        status: 'AVAILABLE',
        lastSterilized: '',
        location: '',
        stockQuantity: '1',
        minStockThreshold: '1',
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create instrument');
    }
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Create Instrument</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Instrument Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Serial Number"
        name="serialNumber"
        value={formData.serialNumber}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="AVAILABLE">Available</MenuItem>
        <MenuItem value="IN_USE">In Use</MenuItem>
        <MenuItem value="STERILIZING">Sterilizing</MenuItem>
        <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
      </TextField>
      <TextField
        label="Last Sterilized"
        name="lastSterilized"
        type="datetime-local"
        value={formData.lastSterilized}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />
      <TextField
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Stock Quantity"
        name="stockQuantity"
        type="number"
        value={formData.stockQuantity}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        inputProps={{ min: 1 }}
      />
      <TextField
        label="Minimum Stock Threshold"
        name="minStockThreshold"
        type="number"
        value={formData.minStockThreshold}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        inputProps={{ min: 1 }}
      />
      <Button type="submit" variant="contained" color="primary" className={styles.button}>
        Create Instrument
      </Button>
    </Box>
  );
}