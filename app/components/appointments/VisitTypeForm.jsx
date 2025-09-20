'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function VisitTypeForm({ visitType, onSubmit, onCancel }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: visitType?.name || '',
    description: visitType?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = visitType?.id ? 'PUT' : 'POST';
      const url = visitType?.id ? `/api/appointments?resource=visitType&id=${visitType.id}` : '/api/appointments';
      const body = visitType?.id ? formData : { ...formData, resource: 'visitType' };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to save visit type');
      onSubmit();
      onCancel();
      router.push('/appointments/visit-types');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-full mx-auto p-4">
      <Typography variant="h5" className="card-title font-bold">
        {visitType?.id ? 'Edit Visit Type' : 'New Visit Type'}
      </Typography>
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
          fullWidth
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          className="textarea"
          multiline
          rows={3}
          fullWidth
        />
        <Box className="flex justify-end gap-2">
          <Button
            variant="outlined"
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="btn-primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <div className="loading-spinner" />}
          >
            {visitType?.id ? 'Update' : 'Create'}
          </Button>
        </Box>
      </form>
    </div>
  );
}