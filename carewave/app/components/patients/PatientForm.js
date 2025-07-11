// app/components/patients/PatientForm.js
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
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params.id;

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, []);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${params.id}?include=addresses,nextOfKin,insuranceInfo`);
      const data = await response.json();
      setFormData({
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        addresses: data.addresses.length ? data.addresses : [{ street: '', city: '', country: '', postalCode: '' }],
        nextOfKin: data.nextOfKin || { firstName: '', lastName: '', relationship: '', phone: '', email: '' },
        insuranceInfo: data.insuranceInfo || { provider: '', policyNumber: '', expiryDate: '' },
      });
    } catch (error) {
      console.error('Failed to fetch patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/patients/${params.id}` : '/api/patients';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      router.push('/patients');
    } catch (error) {
      console.error('Failed to save patient:', error);
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
    <Box className="p-6">
      <Typography variant="h5" className="card-title mb-6">
        {isEdit ? 'Edit Patient' : 'New Patient'}
      </Typography>
      <Paper className="card p-6">
        {loading ? (
          <Box className="flex justify-center p-8">
            <CircularProgress className="loading-spinner" />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange(e)}
                  className="input"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange(e)}
                  className="input"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange(e)}
                  className="input"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange(e)}
                  select
                  className="select"
                  fullWidth
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
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  className="input"
                  fullWidth
                />
              </Grid>
              
              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" className="card-subtitle mt-4 mb-2">Address</Typography>
              </Grid>
              {formData.addresses.map((address, index) => (
                <Grid container spacing={3} key={index}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Street"
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      className="input"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      className="input"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Country"
                      value={address.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      className="input"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Postal Code"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                      className="input"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}

              {/* Next of Kin Section */}
              <Grid item xs={12}>
                <Typography variant="h6" className="card-subtitle mt-4 mb-2">Next of Kin</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.nextOfKin.firstName}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'firstName')}
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.nextOfKin.lastName}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'lastName')}
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Relationship"
                  value={formData.nextOfKin.relationship}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'relationship')}
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={formData.nextOfKin.phone}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'phone')}
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={formData.nextOfKin.email}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'email')}
                  className="input"
                  fullWidth
                />
              </Grid>

              {/* Insurance Section */}
              <Grid item xs={12}>
                <Typography variant="h6" className="card-subtitle mt-4 mb-2">Insurance Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Provider"
                  value={formData.insuranceInfo.provider}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'provider')}
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Policy Number"
                  value={formData.insuranceInfo.policyNumber}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'policyNumber')}
                  className="input"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  value={formData.insuranceInfo.expiryDate}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'expiryDate')}
                  className="input"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Box className="flex gap-4 mt-6">
              <Button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} className="loading-spinner" /> : (isEdit ? 'Update' : 'Create')}
              </Button>
              <Button
                className="btn btn-secondary"
                onClick={() => router.push('/patients')}
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