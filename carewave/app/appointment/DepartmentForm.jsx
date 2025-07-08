"use client";

import React, { useState, useEffect } from 'react';
import { Alert, TextField, Button, Skeleton } from '@mui/material';
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
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`, {
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
      const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`, {
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
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <div className="p-4 bg-hospital-gray-50 dark:bg-hospital-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Manage Departments</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <TextField
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
          >
            {loading ? 'Creating...' : 'Add Department'}
          </Button>
        </form>
        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </div>
        ) : (
          <div className="mt-4">
            <DataGrid
              rows={departments}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white"
              autoHeight
              onCellEditCommit={handleCellEditCommit}
            />
          </div>
        )}
      </div>
    </div>
  );
}