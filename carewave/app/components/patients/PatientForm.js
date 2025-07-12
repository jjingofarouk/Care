"use client";

import React, { useState, useEffect } from 'react';
import { Search } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    createUser: false,
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
        addresses: data.addresses?.length ? data.addresses : [{ street: '', city: '', country: '', postalCode: '' }],
        nextOfKin: data.nextOfKin || { firstName: '', lastName: '', relationship: '', phone: '', email: '' },
        insuranceInfo: data.insuranceInfo || { provider: '', policyNumber: '', expiryDate: '' },
        password: '',
        createUser: !!data.userId,
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
          addresses: formData.addresses.filter((addr) => addr.street || addr.city || addr.country || addr.postalCode),
          nextOfKin: formData.nextOfKin.firstName || formData.nextOfKin.lastName ? formData.nextOfKin : undefined,
          insuranceInfo: formData.insuranceInfo.provider || formData.insuranceInfo.policyNumber ? formData.insuranceInfo : undefined,
          createUser: formData.createUser && formData.email && formData.password ? true : false,
          password: formData.createUser && formData.password ? formData.password : undefined,
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
    <div className="card p-4 max-w-[100vw] overflow-x-auto min-h-screen">
      <h1 className="card-title mb-4">{isEdit ? 'Edit Patient' : 'New Patient'}</h1>
      <div className="bg-[var(--hospital-white)] rounded-xl p-4 shadow-[var(--shadow-sm)]">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="loading-spinner" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange(e)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange(e)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange(e)}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleChange(e)}
                  className="select w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange(e)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  <input
                    type="checkbox"
                    checked={formData.createUser}
                    onChange={(e) => setFormData({ ...formData, createUser: e.target.checked })}
                    className="rounded border-[var(--hospital-gray-300)] text-[var(--hospital-accent)] focus:ring-[var(--hospital-accent)]"
                  />
                  Create User Account
                </label>
              </div>
              {formData.createUser && (
                <div>
                  <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleChange(e)}
                    className="input w-full"
                    required={formData.createUser}
                  />
                </div>
              )}
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-[var(--hospital-gray-900)] mt-4 mb-2">Address</h2>
              </div>
              {formData.addresses.map((address, index) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" key={index}>
                  <div>
                    <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                      Street
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                </div>
              ))}
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-[var(--hospital-gray-900)] mt-4 mb-2">Next of Kin</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.firstName}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'firstName')}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.lastName}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'lastName')}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.relationship}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'relationship')}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.nextOfKin.phone}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'phone')}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.nextOfKin.email}
                  onChange={(e) => handleChange(e, 'nextOfKin', 'email')}
                  className="input w-full"
                />
              </div>
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-[var(--hospital-gray-900)] mt-4 mb-2">Insurance Information</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Provider
                </label>
                <input
                  type="text"
                  value={formData.insuranceInfo.provider}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'provider')}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={formData.insuranceInfo.policyNumber}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'policyNumber')}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.insuranceInfo.expiryDate}
                  onChange={(e) => handleChange(e, 'insuranceInfo', 'expiryDate')}
                  className="input w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <div className="loading-spinner !h-6 !w-6" /> : (isEdit ? 'Update' : 'Create')}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => router.push('/patients')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}