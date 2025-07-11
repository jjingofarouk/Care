"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import { login } from './authService';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      router.push('/appointment');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--hospital-gray-50)] px-4 py-8">
      <form className="w-full max-w-md space-y-6 rounded-lg bg-[var(--hospital-white)] p-6 sm:p-8 shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-[var(--hospital-gray-900)] text-center sm:text-3xl">Welcome Back</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-500)] w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input w-full pl-10"
              required
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--hospital-gray-700)]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-500)] w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input w-full pl-10"
              required
              placeholder="Enter your password"
            />
          </div>
        </div>
        {error && <p className="text-sm text-[var(--hospital-error)] text-center">{error}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-md bg-[var(--hospital-accent)] px-4 py-2 text-[var(--hospital-white)] hover:bg-opacity-90 transition-colors"
        >
          <LogIn className="w-5 h-5" />
          Login
        </button>
        <p className="text-center text-sm text-[var(--hospital-gray-700)]">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="text-[var(--hospital-accent)] hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}