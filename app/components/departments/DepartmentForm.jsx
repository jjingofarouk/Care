import React from 'react';
import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function DepartmentForm({ department, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    departmentType: department?.departmentType || 'CLINICAL',
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
        label="Department Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        className="input"
        required
      />
      <FormControl fullWidth className="select">
        <InputLabel>Department Type</InputLabel>
        <Select
          name="departmentType"
          value={formData.departmentType}
          onChange={handleChange}
          required
        >
          <MenuItem value="CLINICAL">Clinical</MenuItem>
          <MenuItem value="ADMINISTRATIVE">Administrative</MenuItem>
          <MenuItem value="SUPPORT">Support</MenuItem>
        </Select>
      </FormControl>
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          className="btn btn-primary"
        >
          {department ? 'Update' : 'Create'} Department
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