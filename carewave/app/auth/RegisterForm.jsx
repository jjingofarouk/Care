"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from './authService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'PATIENT',
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      router.push('/auth/login');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--hospital-gray-50)] px-4">
      <form className="w-full max-w-md space-y-6 rounded-lg bg-[var(--hospital-white)] p-6 sm:p-8 shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-[var(--hospital-gray-900)] text-center">Register</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="LAB_TECHNICIAN">Lab Technician</option>
            <option value="PHARMACIST">Pharmacist</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="RADIOLOGIST">Radiologist</option>
            <option value="SURGEON">Surgeon</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="ACCOUNTANT">Accountant</option>
            <option value="BILLING_OFFICER">Billing Officer</option>
            <option value="HOSPITAL_MANAGER">Hospital Manager</option>
            <option value="IT_SUPPORT">IT Support</option>
            <option value="CLEANING_STAFF">Cleaning Staff</option>
            <option value="SECURITY">Security</option>
          </select>
        </div>
        {error && <p className="text-sm text-[var(--hospital-error)] text-center">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-[var(--hospital-accent)] px-4 py-2 text-[var(--hospital-white)] hover:bg-opacity-90 transition-colors"
        >
          Register
        </button>
        <p className="text-center text-sm text-[var(--hospital-gray-700)]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[var(--hospital-accent)] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}