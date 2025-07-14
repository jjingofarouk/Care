// app/components/adt/DischargeForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import adtService from '../../services/adtService';

export default function DischargeForm({ open, onClose, admission, onSave }) {
  const [formData, setFormData] = useState({
    dischargeDate: new Date(),
    notes: '',
  });

  useEffect(() => {
    if (admission) {
      setFormData({ dischargeDate: new Date(), notes: '' });
    }
  }, [admission]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dischargeDate: date });
  };

  const handleSubmit = async () => {
    try {
      await adtService.dischargePatient(admission.id, formData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error discharging patient:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Discharge Patient</DialogTitle>
        <DialogContent>
          <TextField
            label="Notes"
            value={formData.notes}
            onChange={handleChange('notes')}
            fullWidth
            margin="dense"
            multiline
            rows={4}
          />
          <DatePicker
            label="Discharge Date"
            value={formData.dischargeDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Discharge</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}