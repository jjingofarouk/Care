// app/components/adt/AdmissionForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import adtService from '../../services/adtService';

export default function AdmissionForm({ open, onClose, admission, onSave }) {
  const [formData, setFormData] = useState({
    patientId: '',
    wardId: '',
    bedId: '',
    admissionDate: new Date(),
  });
  const [patients, setPatients] = useState([]);
  const [wards, setWards] = useState([]);
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    if (admission) {
      setFormData({
        patientId: admission.patient.id,
        wardId: admission.ward.id,
        bedId: admission.bed?.id || '',
        admissionDate: new Date(admission.admissionDate),
      });
    }
    fetchData();
  }, [admission]);

  const fetchData = async () => {
    try {
      const [patientData, wardData, bedData] = await Promise.all([
        adtService.getPatients(),
        adtService.getWards(),
        adtService.getBeds(),
      ]);
      setPatients(patientData);
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
    setFormData({ ...formData, admissionDate: date });
  };

  const handleSubmit = async () => {
    try {
      if (admission) {
        await adtService.updateAdmission(admission.id, formData);
      } else {
        await adtService.createAdmission(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving admission:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{admission ? 'Edit Admission' : 'New Admission'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Patient"
            value={formData.patientId}
            onChange={handleChange('patientId')}
            fullWidth
            margin="dense"
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Ward"
            value={formData.wardId}
            onChange={handleChange('wardId')}
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
            label="Bed"
            value={formData.bedId}
            onChange={handleChange('bedId')}
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
            label="Admission Date"
            value={formData.admissionDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}