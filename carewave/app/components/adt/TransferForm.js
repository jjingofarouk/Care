// app/components/adt/TransferForm.js
'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import adtService from '../../services/adtService';

export default function TransferForm({ open, onClose, admission, onSave }) {
  const [formData, setFormData] = useState({
    toWardId: '',
    toBedId: '',
    transferDate: new Date(),
  });
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    if (admission) {
      setFormData({ toWardId: '', toBedId: '', transferDate: new Date() });
    }
    fetchData();
  }, [admission]);

  const fetchData = async () => {
    try {
      const [wardData, bedData] = await Promise.all([
        adtService.getWards(),
        adtService.getBeds(),
      ]);
      setWards(wardData);
      setBeds(bedData.filter(bed => !bed.isOccupied));
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, transferDate: date });
  };

  const handleSubmit = async () => {
    try {
      await adtService.transferPatient(admission.id, formData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error transferring patient:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Transfer Patient</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="To Ward"
            value={formData.toWardId}
            onChange={handleChange('toWardId')}
            fullWidth
            margin="dense"
          >
            {wards.map((ward) => (
              <MenuItem key={ward.id} value={ward.id}>
                {ward.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="To Bed"
            value={formData.toBedId}
            onChange={handleChange('toBedId')}
            fullWidth
            margin="dense"
          >
            <MenuItem value="">No Bed</MenuItem>
            {beds.map((bed) => (
              <MenuItem key={bed.id} value={bed.id}>
                {bed.bedNumber} ({bed.wardName})
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            label="Transfer Date"
            value={formData.transferDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Transfer</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}