"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, TextField, Button, Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import api from '../api';

export default function DepartmentForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=departments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedDepartments = response.data.map((dept, index) => ({
          ...dept,
          id: dept.id || index + 1,
        }));
        setDepartments(formattedDepartments);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Department name is required.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ name: '', description: '' });
      const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedDepartments = response.data.map((dept, index) => ({
        ...dept,
        id: dept.id || index + 1,
      }));
      setDepartments(formattedDepartments);
      setError(null);
    } catch (err) {
      setError('Failed to create department: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCellEditCommit = async (params) => {
    try {
      const token = localStorage.getItem('token');
      const { id, field, value } = params;
      const updatePayload = { [field]: value };

      await axios.put(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}/${id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDepartments(departments.map(dept =>
        dept.id === id ? { ...dept, [field]: value } : dept
      ));
      setError(null);
      setEditingCell(null);
    } catch (err) {
      setError('Failed to update department: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(departments.filter(dept => dept.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete department: ' + (err.response?.data?.error || err.message));
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Department Name',
      width: 200,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={params.value || ''}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          multiline
          rows={3}
          fullWidth
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.row.id)}
          variant="outlined"
          color="error"
          size="small"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Manage Departments</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <TextField
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Add Department'}
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={departments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            onCellEditStart={(params) => setEditingCell({ id: params.id, field: params.field })}
            onCellEditStop={() => setEditingCell(null)}
            onCellEditCommit={handleCellEditCommit}
          />
        </Box>
      )}
    </Box>
  );
}