import React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Chip, Box } from '@mui/material';
import { getDepartments } from '../../services/departmentService';
import { getSpecializations } from '../../services/doctorService';

export default function DoctorForm({ doctor, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: doctor?.firstName || '',
    lastName: doctor?.lastName || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    departmentId: doctor?.departmentId || '',
    specializationIds: doctor?.specializations?.map(s => s.specializationId) || [],
  });
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptData, specData] = await Promise.all([
          getDepartments(),
          getSpecializations()
        ]);
        setDepartments(deptData || []);
        setSpecializations(specData || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setDepartments([]);
        setSpecializations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e) => {
    setFormData(prev => ({ ...prev, specializationIds: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        className="input"
        required
      />
      <TextField
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        className="input"
        required
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        className="input"
        required
      />
      <TextField
        name="phone"
        label="Phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        className="input"
      />
      <FormControl fullWidth className="select">
        <InputLabel>Department</InputLabel>
        <Select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
        >
          {departments.length > 0 ? (
            departments.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))
          ) : (
            <MenuItem disabled>No departments available</MenuItem>
          )}
        </Select>
      </FormControl>
      <FormControl fullWidth className="select">
        <InputLabel>Specializations</InputLabel>
        <Select
          multiple
          value={formData.specializationIds}
          onChange={handleSpecializationChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const spec = specializations.find(s => s.id === value);
                return (
                  <Chip
                    key={value}
                    label={spec?.name || 'Unknown'}
                  />
                );
              })}
            </Box>
          )}
        >
          {specializations.length > 0 ? (
            specializations.map(spec => (
              <MenuItem key={spec.id} value={spec.id}>{spec.name}</MenuItem>
            ))
          ) : (
            <MenuItem disabled>No specializations available</MenuItem>
          )}
        </Select>
      </FormControl>
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="contained"
          className="btn btn-primary"
          disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.departmentId}
        >
          {doctor ? 'Update' : 'Create'} Doctor
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