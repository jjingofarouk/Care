import React from 'react';
import { useState } from 'react';
import { TextField, Button } from '@mui/material';

export default function SpecializationForm({ specialization, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: specialization?.name || '',
    description: specialization?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        name="name"
        label="Specialization Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        className="input"
        required
      />
      <TextField
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        className="input"
        multiline
        rows={4}
      />
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          className="btn btn-primary"
        >
          {specialization ? 'Update' : 'Create'} Specialization
        </Button>
        <Button
          type="button"
          variant="outlined"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}