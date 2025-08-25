'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress, FormControl, InputLabel, Select } from '@mui/material';
import { getDepartments } from '@/services/operationTheatreService';

const TheatreForm = ({ onClose, onSuccess, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    departmentId: initialData.departmentId || '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/surgeries?type=theatre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save theatre');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{initialData.id ? 'Edit Theatre' : 'Add Operating Theatre'}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Theatre Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormControl>
              <InputLabel>Department</InputLabel>
              <Select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TheatreForm;