import React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getDepartments } from '../../services/departmentService';

export default function UnitForm({ unit, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: unit?.name || '',
    departmentId: unit?.departmentId || '',
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await getDepartments();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

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
        label="Unit Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        className="input"
        required
      />
      <FormControl fullWidth className="select">
        <InputLabel>Department</InputLabel>
        <Select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
        >
          {departments.map(dept => (
            <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          className="btn btn-primary"
        >
          {unit ? 'Update' : 'Create'} Unit
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