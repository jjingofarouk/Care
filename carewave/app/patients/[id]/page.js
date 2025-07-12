// app/patients/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert,
  IconButton,
  Paper
} from '@mui/material';
import { 
  Edit, 
  ArrowBack, 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  ContactEmergency, 
  HealthAndSafety,
  AccountBox,
  CalendarMonth
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

export default function PatientDetailPage() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id;

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/patients/${patientId}?include=addresses,nextOfKin,insuranceInfo`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Patient not found');
        }
        throw new Error(`Failed to fetch patient: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPatient(data);
    } catch (error) {
      console.error('Failed to fetch patient:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    
    try {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) return 'Invalid date';
      
      const today = new Date();
      const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 0 ? `${age} years old` : 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    
    const parts = [
      address.street,
      address.city,
      address.country,
      address.postalCode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  const isInsuranceExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => router.push('/patients')}
          startIcon={<ArrowBack />}
        >
          Back to Patients
        </Button>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Patient not found
        </Alert>
        <Button 
          variant="outlined" 
          onClick={() => router.push('/patients')}
          startIcon={<ArrowBack />}
        >
          Back to Patients
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.push('/patients')}
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Patient Details
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => router.push(`/patients/edit/${patient.id}`)}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Edit Patient
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Patient ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {patient.id}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {patient.firstName} {patient.lastName}
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(patient.dateOfBirth)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Age
                    </Typography>
                    <Typography variant="body1">
                      {calculateAge(patient.dateOfBirth)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {patient.gender || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Phone sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Contact Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {patient.email || 'No email provided'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Phone Number
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {patient.phone || 'No phone number provided'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    User Account Status
                  </Typography>
                  <Chip
                    icon={<AccountBox />}
                    label={patient.userId ? 'Has User Account' : 'No User Account'}
                    color={patient.userId ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Address Information
                </Typography>
              </Box>
              
              {patient.addresses && patient.addresses.length > 0 ? (
                <Grid container spacing={2}>
                  {patient.addresses.map((address, index) => (
                    <Grid item xs={12} md={6} key={address.id || index}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          {patient.addresses.length > 1 ? `Address ${index + 1}` : 'Primary Address'}
                        </Typography>
                        <Typography variant="body1">
                          {formatAddress(address)}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No address information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ContactEmergency sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Emergency Contact
                </Typography>
              </Box>
              
              {patient.nextOfKin ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {patient.nextOfKin.firstName} {patient.nextOfKin.lastName}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Relationship
                    </Typography>
                    <Typography variant="body1">
                      {patient.nextOfKin.relationship || 'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {patient.nextOfKin.phone || 'No phone provided'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {patient.nextOfKin.email || 'No email provided'}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No emergency contact information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Insurance Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HealthAndSafety sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Insurance Information
                </Typography>
              </Box>
              
              {patient.insuranceInfo ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Insurance Provider
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {patient.insuranceInfo.provider || 'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Policy Number
                    </Typography>
                    <Typography variant="body1">
                      {patient.insuranceInfo.policyNumber || 'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Expiry Date
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {formatDate(patient.insuranceInfo.expiryDate)}
                      </Typography>
                      {patient.insuranceInfo.expiryDate && isInsuranceExpired(patient.insuranceInfo.expiryDate) && (
                        <Chip 
                          label="Expired" 
                          color="error" 
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No insurance information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                System Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(patient.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(patient.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}