'use client';
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Alert, Typography } from '@mui/material';
import { createCssdRecord, getInstruments } from './cssdService';
import styles from './CssdForm.module.css';

export default function CssdForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    instrumentId: '',
    sterilizationDate: '',
    sterilizationMethod: '',
    cycleNumber: '',
    status: 'PENDING',
    qualityCheck: '',
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
      await createCssdRecord(formData);
      setFormData({
        instrumentId: '',
        sterilizationDate: '',
        sterilizationMethod: '',
        cycleNumber: '',
        status: 'PENDING',
        qualityCheck: '',
        notes: '',
      });
      setError(null);
      onSuccess();
    } catch (err) {
      setError('Failed to create CSSD record');
    }
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Create Sterilization Record</Typography>
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
        label="Sterilization Date"
        name="sterilizationDate"
        type="datetime-local"
        value={formData.sterilizationDate}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        margin="normal"
      />
      <TextField
        select
        label="Sterilization Method"
        name="sterilizationMethod"
        value={formData.sterilizationMethod}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="STEAM">Steam</MenuItem>
        <MenuItem value="ETO">ETO</MenuItem>
        <MenuItem value="PLASMA">Plasma</MenuItem>
      </TextField>
      <TextField
        label="Cycle Number"
        name="cycleNumber"
        value={formData.cycleNumber}
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
        <MenuItem value="PENDING">Pending</MenuItem>
        <MenuItem value="STERILIZED">Sterilized</MenuItem>
        <MenuItem value="USED">Used</MenuItem>
        <MenuItem value="FAILED">Failed</MenuItem>
      </TextField>
      <TextField
        select
        label="Quality Check"
        name="qualityCheck"
        value={formData.qualityCheck}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="PASS">Pass</MenuItem>
        <MenuItem value="FAIL">Fail</MenuItem>
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
        Create Record
      </Button>
    </Box>
  );
}