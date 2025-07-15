// page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, User, UserPlus, Eye, EyeOff, Shield, Heart, 
  CheckCircle, Stethoscope, Users, Settings, LogIn 
} from 'lucide-react';
import { login, register } from './authService';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '', password: '', firstName: '', lastName: '', role: 'PATIENT'
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const roleCategories = {
    'Patient Care': [
      { value: 'PATIENT', label: 'Patient', description: 'Access medical records and appointments' },
      { value: 'DOCTOR', label: 'Doctor', description: 'Manage patients and clinical data' },
      { value: 'NURSE', label: 'Nurse', description: 'Patient care and nursing services' },
      { value: 'SURGEON', label: 'Surgeon', description: 'Surgical procedures and operations' },
    ],
    'Medical Services': [
      { value: 'LAB_TECHNICIAN', label: 'Lab Technician', description: 'Laboratory tests and analysis' },
      { value: 'PHARMACIST', label: 'Pharmacist', description: 'Medication management' },
      { value: 'RADIOLOGIST', label: 'Radiologist', description: 'Medical imaging and diagnostics' },
    ],
    'Administrative': [
      { value: 'ADMIN', label: 'Admin', description: 'System administration' },
      { value: 'RECEPTIONIST', label: 'Receptionist', description: 'Patient reception and scheduling' },
      { value: 'HOSPITAL_MANAGER', label: 'Hospital Manager', description: 'Hospital operations management' },
      { value: 'BILLING_OFFICER', label: 'Billing Officer', description: 'Financial and billing services' },
      { value: 'ACCOUNTANT', label: 'Accountant', description: 'Financial accounting' },
    ],
    'Support Staff': [
      { value: 'STAFF', label: 'Staff', description: 'General hospital staff' },
      { value: 'IT_SUPPORT', label: 'IT Support', description: 'Technical support' },
      { value: 'CLEANING_STAFF', label: 'Cleaning Staff', description: 'Facility maintenance' },
      { value: 'SECURITY', label: 'Security', description: 'Security and safety' },
    ],
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(loginData);
      router.push('/appointment');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register(registerData);
      router.push('/auth/login');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return registerData.firstName && registerData.lastName;
      case 2:
        return registerData.email && registerData.password;
      case 3:
        return registerData.role;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--hospital-gray-50)] px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--hospital-accent)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[var(--hospital-accent-light)] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--hospital-accent-dark)] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg card glass">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--hospital-accent)] rounded-2xl shadow-lg mb-4 relative">
            <div className="absolute inset-0 bg-[var(--hospital-accent)] rounded-2xl opacity-20 blur-xl"></div>
            <Heart className="w-10 h-10 text-[var(--hospital-white)] relative z-10" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">CareWave</h1>
          <p className="text-[var(--hospital-gray-500)] text-lg">
            {isLogin ? 'Healthcare Management System' : 'Join our healthcare community'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`btn ${isLogin ? 'btn-primary' : 'btn-outline'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`btn ${!isLogin ? 'btn-primary' : 'btn-outline'}`}
            >
              Register
            </button>
          </div>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="card-title">Welcome Back</h2>
              <p className="card-subtitle">Sign in to access your dashboard</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--hospital-gray-700)]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] w-5 h-5 group-focus-within:text-[var(--hospital-accent)]" />
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="input w-full pl-12"
                  required
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--hospital-gray-700)]">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] w-5 h-5 group-focus-within:text-[var(--hospital-accent)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="input w-full pl-12 pr-12"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] hover:text-[var(--hospital-gray-600)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                <div className="w-2 h-2 bg-[var(--hospital-error)] rounded-full"></div>
                <p>{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[var(--hospital-accent)] border-[var(--hospital-gray-300)] rounded"
                />
                <span className="text-sm text-[var(--hospital-gray-600)]">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner w-5 h-5"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--hospital-gray-300)] to-transparent"></div>
              <span className="px-4 text-sm text-[var(--hospital-gray-500)] bg-[var(--bg-secondary)] rounded-full">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--hospital-gray-300)] to-transparent"></div>
            </div>

            <div className="text-center">
              <p className="text-[var(--hospital-gray-600)] mb-4">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] font-semibold"
                >
                  Create Account
                </button>
              </p>
              <div className="badge badge-success">
                <Shield className="w-4 h-4" />
                Secure Login
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="card-title">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Account Details"}
                {currentStep === 3 && "Role Selection"}
              </h2>
              <p className="card-subtitle">
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Create your login credentials"}
                {currentStep === 3 && "Choose your role in the system"}
              </p>
            </div>

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[var(--hospital-gray-700)]">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] w-5 h-5 group-focus-within:text-[var(--hospital-accent)]" />
                      <input
                        type="text"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        className="input w-full pl-12"
                        required
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[var(--hospital-gray-700)]">Last Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] w-5 h-5 group-focus-within:text-[var(--hospital-accent)]" />
                      <input
                        type="text"
                        name="lastName"
                        value={registerData.lastName}
                        onChange={handleRegisterChange}
                        className="input w-full pl-12"
                        required
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--hospital-gray-700)]">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] w-5 h-5 group-focus-within:text-[var(--hospital-accent)]" />
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="input w-full pl-12"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[var(--hospital-gray-700)]">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] w-5 h-5 group-focus-within:text-[var(--hospital-accent)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="input w-full pl-12 pr-12"
                      required
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--hospital-gray-400)] hover:text-[var(--hospital-gray-600)]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 custom-scrollbar max-h-[400px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(roleCategories).map(([category, roles]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-semibold text-[var(--hospital-gray-800)] flex items-center gap-2">
                        {category === 'Patient Care' && <Stethoscope className="w-5 h-5" />}
                        {category === 'Medical Services' && <Heart className="w-5 h-5" />}
                        {category === 'Administrative' && <Settings className="w-5 h-5" />}
                        {category === 'Support Staff' && <Users className="w-5 h-5" />}
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {roles.map((role) => (
                          <label key={role.value} className="block cursor-pointer">
                            <input
                              type="radio"
                              name="role"
                              value={role.value}
                              checked={registerData.role === role.value}
                              onChange={handleRegisterChange}
                              className="sr-only"
                            />
                            <div className={`card p-4 border-2 ${
                              registerData.role === role.value
                                ? 'border-[var(--hospital-accent)] bg-[var(--hospital-accent)]/10'
                                : 'border-[var(--hospital-gray-200)] hover:border-[var(--hospital-gray-300)]'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-[var(--hospital-gray-800)]">{role.label}</h4>
                                  <p className="text-sm text-[var(--hospital-gray-600)]">{role.description}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 ${
                                  registerData.role === role.value
                                    ? 'border-[var(--hospital-accent)] bg-[var(--hospital-accent)]'
                                    : 'border-[var(--hospital-gray-300)]'
                                }`}>
                                  {registerData.role === role.value && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-[var(--hospital-white)] rounded-full"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <div className="w-2 h-2 bg-[var(--hospital-error)] rounded-full"></div>
                <p>{error}</p>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`btn btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !isStepValid()}
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner w-5 h-5"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {isLogin && (
              <div className="text-center mt-8">
                <p className="text-[var(--hospital-gray-600)] mb-4">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] font-semibold"
                  >
                    Create Account
                  </button>
                </p>
                <div className="badge badge-success">
                  <Shield className="w-4 h-4" />
                  Secure Login
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="text-center mt-8">
                <p className="text-[var(--hospital-gray-600)] mb-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[var(--hospital-accent)] hover:text-[var(--hospital-accent-dark)] font-semibold"
                  >
                    Sign In
                  </button>
                </p>
                <div className="badge badge-success">
                  <Shield className="w-4 h-4" />
                  Secure Registration
                </div>
              </div>
            )}
          </form>
        )}

        <div className="text-center mt-8 text-[var(--hospital-gray-500)] text-sm">
          <p>© 2024 CareWave. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/privacy" className="hover:text-[var(--hospital-gray-700)]">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-[var(--hospital-gray-700)]">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}