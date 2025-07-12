"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  MenuItem, 
  CircularProgress, 
  Grid, 
  Paper 
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    addresses: [{ street: '', city: '', country: '', postalCode: '' }],
    nextOfKin: { firstName: '', lastName: '', relationship: '', phone: '', email: '' },
    insuranceInfo: { provider: '', policyNumber: '', expiryDate: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [params.id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${params.id}?include=addresses,nextOfKin,insuranceInfo`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      const data = await response.json();
      setFormData({
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
        addresses: data.addresses.length ? data.addresses : [{ street: '', city: '', country: '', postalCode: '' }],
        nextOfKin: data.nextOfKin || { firstName: '', lastName: '', relationship: '', phone: '', email: '' },
        insuranceInfo: data.insuranceInfo || { provider: '', policyNumber: '', expiryDate: '' },
      });
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      setError('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/patients/${params.id}` : '/api/patients';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          addresses: formData.addresses.filter(addr => addr.street || addr.city || addr.country || addr.postalCode),
          nextOfKin: formData.nextOfKin.firstName || formData.nextOfKin.lastName ? formData.nextOfKin : undefined,
          insuranceInfo: formData.insuranceInfo.provider || formData.insuranceInfo.policyNumber ? formData.insuranceInfo : undefined,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save patient');
      }
      router.push('/patients');
    } catch (error) {
      console.error('Failed to save patient:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, section, field) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;
    setFormData({ ...formData, addresses: newAddresses });
  };

  return (
    <Box sx={{ p: 4, maxWidth: '100%', overflowX: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        {isEdit ? 'Edit Patient' : 'New Patient'}
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange(e)}
                  select
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 3, mb: 2 }}>
                  Address
                </Typography>
              </Grid>
              {formData.addresses.map((address, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Street"
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Country"
                      value={address.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Postal Code"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}

              {/* Next of Kin Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 3, mb: 2 }}>
                  Next of Kin
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.nextOfKin.firstName}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'firstName')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.nextOfKin.lastName}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'lastName')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Relationship"
                  value={formData.nextOfKin.relationship}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'relationship')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={formData.nextOfKin.phone}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'phone')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={formData.nextOfKin.email}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'email')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Insurance Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mt: 3, mb: 2 }}>
                  Insurance Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Provider"
                  value={formData.insuranceInfo.provider}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'provider')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Policy Number"
                  value={formData.insuranceInfo.policyNumber}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'policyNumber')}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={formData.insuranceInfo.expiryDate}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'expiryDate')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/patients')}
                sx={{ borderColor: 'grey.500', color: 'grey.700' }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}