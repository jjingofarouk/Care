"use client";
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, Grid } from '@mui/material';
import { getWards, updateWard, deleteWard } from './adtService';

export default function WardList() {
  const [wards, setWards] = useState([]);
  const [editWard, setEditWard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    wardNumber: '',
    totalBeds: '',
    occupiedBeds: '',
    department: '',
    location: '',
    nurseInCharge: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const data = await getWards();
      setWards(data);
    } catch (error) {
      setError('Failed to fetch wards');
    }
  };

  const handleEdit = (ward) => {
    setEditWard(ward);
    setFormData({
      name: ward.name,
      wardNumber: ward.wardNumber,
      totalBeds: ward.totalBeds.toString(),
      occupiedBeds: ward.occupiedBeds.toString(),
      department: ward.department || '',
      location: ward.location || '',
      nurseInCharge: ward.nurseInCharge || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateWard(editWard.id, {
        name: formData.name,
        wardNumber: formData.wardNumber,
        totalBeds: parseInt(formData.totalBeds),
        occupiedBeds: parseInt(formData.occupiedBeds),
        department: formData.department,
        location: formData.location,
        nurseInCharge: formData.nurseInCharge,
      });
      setEditWard(null);
      setFormData({
        name: '',
        wardNumber: '',
        totalBeds: '',
        occupiedBeds: '',
        department: '',
        location: '',
        nurseInCharge: '',
      });
      fetchWards();
    } catch (error) {
      setError('Failed to update ward');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this ward?')) {
      try {
        await deleteWard(id);
        fetchWards();
      } catch (error) {
        setError('Failed to delete ward');
      }
    }
  };

  const handleClose = () => {
    setEditWard(null);
    setFormData({
      name: '',
      wardNumber: '',
      totalBeds: '',
      occupiedBeds: '',
      department: '',
      location: '',
      nurseInCharge: '',
    });
    setError(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Ward List</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Ward Number</TableCell>
              <TableCell>Total Beds</TableCell>
              <TableCell>Occupied Beds</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Nurse In Charge</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wards.map((ward) => (
              <TableRow key={ward.id}>
                <TableCell>{ward.name}</TableCell>
                <TableCell>{ward.wardNumber}</TableCell>
                <TableCell>{ward.totalBeds}</TableCell>
                <TableCell>{ward.occupiedBeds}</TableCell>
                <TableCell>{ward.department}</TableCell>
                <TableCell>{ward.location}</TableCell>
                <TableCell>{ward.nurseInCharge}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(ward)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(ward.id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editWard} onClose={handleClose}>
        <DialogTitle>Edit Ward</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ward Number"
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total Beds"
                  name="totalBeds"
                  type="number"
                  value={formData.totalBeds}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Occupied Beds"
                  name="occupiedBeds"
                  type="number"
                  value={formData.occupiedBeds}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nurse In Charge"
                  name="nurseInCharge"
                  value={formData.nurseInCharge}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}