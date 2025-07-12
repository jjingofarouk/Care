"use client";

import React, { useState, useEffect } from 'react';
import { Edit, ArrowBack, Person, Email, Phone, LocationOn, ContactEmergency, HealthAndSafety, AccountBox, CalendarMonth } from '@mui/icons-material';
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loading-spinner !h-12 !w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 max-w-[1200px] mx-auto">
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
        <button 
          className="btn btn-outline"
          onClick={() => router.push('/patients')}
        >
          <ArrowBack className="w-4 h-4 mr-2" />
          Back to Patients
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="card p-4 max-w-[1200px] mx-auto">
        <div className="alert alert-warning mb-4">
          <span>Patient not found</span>
        </div>
        <button 
          className="btn btn-outline"
          onClick={() => router.push('/patients')}
        >
          <ArrowBack className="w-4 h-4 mr-2" />
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="card p-4 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-outline !p-2"
            onClick={() => router.push('/patients')}
          >
            <ArrowBack className="w-4 h-4" />
          </button>
          <h1 className="card-title">Patient Details</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => router.push(`/patients/edit/${patient.id}`)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Personal Information */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Person className="w-5 h-5 text-[var(--hospital-accent)]" />
            <h2 className="card-title">Personal Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <span className="card-subtitle">Patient ID</span>
              <p className="font-medium text-[var(--hospital-gray-900)]">{patient.id}</p>
            </div>
            <div>
              <span className="card-subtitle">Full Name</span>
              <p className="text-lg font-bold text-[var(--hospital-gray-900)]">{patient.firstName} {patient.lastName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="card-subtitle">Date of Birth</span>
                <p className="text-[var(--hospital-gray-900)]">{formatDate(patient.dateOfBirth)}</p>
              </div>
              <div>
                <span className="card-subtitle">Age</span>
                <p className="text-[var(--hospital-gray-900)]">{calculateAge(patient.dateOfBirth)}</p>
              </div>
            </div>
            <div>
              <span className="card-subtitle">Gender</span>
              <p className="text-[var(--hospital-gray-900)]">{patient.gender || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Phone className="w-5 h-5 text-[var(--hospital-accent)]" />
            <h2 className="card-title">Contact Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <span className="card-subtitle">Email Address</span>
              <div className="flex items-center gap-2">
                <Email className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                <p className="text-[var(--hospital-gray-900)]">{patient.email || 'No email provided'}</p>
              </div>
            </div>
            <div>
              <span className="card-subtitle">Phone Number</span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                <p className="text-[var(--hospital-gray-900)]">{patient.phone || 'No phone number provided'}</p>
              </div>
            </div>
            <div>
              <span className="card-subtitle">User Account Status</span>
              <span className={`badge ${patient.userId ? 'badge-success' : 'badge-neutral'} mt-1`}>
                <AccountBox className="w-4 h-4 mr-1" />
                {patient.userId ? 'Has User Account' : 'No User Account'}
              </span>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card md:col-span-2">
          <div className="card-header flex items-center gap-2">
            <LocationOn className="w-5 h-5 text-[var(--hospital-accent)]" />
            <h2 className="card-title">Address Information</h2>
          </div>
          <div className="p-4">
            {patient.addresses && patient.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {patient.addresses.map((address, index) => (
                  <div key={address.id || index} className="bg-[var(--hospital-gray-50)] rounded-lg p-2">
                    <span className="card-subtitle">{patient.addresses.length > 1 ? `Address ${index + 1}` : 'Primary Address'}</span>
                    <p className="text-[var(--hospital-gray-900)]">{formatAddress(address)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--hospital-gray-500)]">No address information available</p>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <ContactEmergency className="w-5 h-5 text-[var(--hospital-accent)]" />
            <h2 className="card-title">Emergency Contact</h2>
          </div>
          <div className="p-4 space-y-4">
            {patient.nextOfKin ? (
              <>
                <div>
                  <span className="card-subtitle">Name</span>
                  <p className="font-medium text-[var(--hospital-gray-900)]">{patient.nextOfKin.firstName} {patient.nextOfKin.lastName}</p>
                </div>
                <div>
                  <span className="card-subtitle">Relationship</span>
                  <p className="text-[var(--hospital-gray-900)]">{patient.nextOfKin.relationship || 'Not specified'}</p>
                </div>
                <div>
                  <span className="card-subtitle">Phone</span>
                  <p className="text-[var(--hospital-gray-900)]">{patient.nextOfKin.phone || 'No phone provided'}</p>
                </div>
                <div>
                  <span className="card-subtitle">Email</span>
                  <p className="text-[var(--hospital-gray-900)]">{patient.nextOfKin.email || 'No email provided'}</p>
                </div>
              </>
            ) : (
              <p className="text-[var(--hospital-gray-500)]">No emergency contact information available</p>
            )}
          </div>
        </div>

        {/* Insurance Information */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <HealthAndSafety className="w-5 h-5 text-[var(--hospital-accent)]" />
            <h2 className="card-title">Insurance Information</h2>
          </div>
          <div className="p-4 space-y-4">
            {patient.insuranceInfo ? (
              <>
                <div>
                  <span className="card-subtitle">Insurance Provider</span>
                  <p className="font-medium text-[var(--hospital-gray-900)]">{patient.insuranceInfo.provider || 'Not specified'}</p>
                </div>
                <div>
                  <span className="card-subtitle">Policy Number</span>
                  <p className="text-[var(--hospital-gray-900)]">{patient.insuranceInfo.policyNumber || 'Not specified'}</p>
                </div>
                <div>
                  <span className="card-subtitle">Expiry Date</span>
                  <div className="flex items-center gap-2">
                    <CalendarMonth className="w-4 h-4 text-[var(--hospital-gray-500)]" />
                    <p className="text-[var(--hospital-gray-900)]">{formatDate(patient.insuranceInfo.expiryDate)}</p>
                    {patient.insuranceInfo.expiryDate && isInsuranceExpired(patient.insuranceInfo.expiryDate) && (
                      <span className="badge badge-error">Expired</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[var(--hospital-gray-500)]">No insurance information available</p>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="card md:col-span-2">
          <div className="card-header">
            <h2 className="card-title">System Information</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="card-subtitle">Created Date</span>
              <p className="text-[var(--hospital-gray-900)]">{formatDate(patient.createdAt)}</p>
            </div>
            <div>
              <span className="card-subtitle">Last Updated</span>
              <p className="text-[var(--hospital-gray-900)]">{formatDate(patient.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}