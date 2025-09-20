'use client';
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Alert, Typography } from '@mui/material';
import { createRequisition, getInstruments } from './cssdService';
import styles from './CssdForm.module.css';

export default function CssdRequisitionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    instrumentId: '',
    department: '',
    requestedBy: 1, // Replace with actual user ID
    quantity: 1,
    status: 'PENDING',
    notes: '',
  });
  const [instruments, setInstruments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const data = await getInstruments();
        setInstruments(data);
      } catch (err) {
        setError('Failed to fetch instruments');
      }
    }
    fetchInstruments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequisition(formData);
      setFormData({
        instrumentId: '',
        department: '',
        requestedBy: 1,
        quantity: 1,
        status: 'PENDING',
        notes: '',
      });
      setError(null);
      onSuccess();
    } catch (err) {
      setError('Failed to create requisition');
    }
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Create Requisition</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        select
        label="Instrument"
        name="instrumentId"
        value={formData.instrumentId}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      >
        {instruments.map((instrument) => (
          <MenuItem key={instrument.id} value={instrument.id}>
            {instrument.name} ({instrument.serialNumber})
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        fullWidth
        required
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
        <MenuItem value="PENDING">Pending</MenuItem>
        <MenuItem value="APPROVED">Approved</MenuItem>
        <MenuItem value="DISPATCHED">Dispatched</MenuItem>
        <MenuItem value="REJECTED">Rejected</MenuItem>
      </TextField>
      <TextField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" className={styles.button}>
        Create Requisition
      </Button>
    </Box>
  );
}
