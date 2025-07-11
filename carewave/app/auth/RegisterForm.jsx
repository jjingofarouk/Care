"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, User, UserPlus, Eye, EyeOff, Shield, Heart, 
  CheckCircle, Stethoscope, Users, Settings 
} from 'lucide-react';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await register(formData);
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
        return formData.firstName && formData.lastName;
      case 2:
        return formData.email && formData.password;
      case 3:
        return formData.role;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl opacity-20 blur-xl"></div>
            <Heart className="w-10 h-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            CareWave
          </h1>
          <p className="text-gray-600 text-lg">Join our healthcare community</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl"></div>
          
          <div className="relative z-10">
            {/* Step Progress */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-full h-1 mx-4 transition-all duration-300 ${
                      step < currentStep ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step Headers */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Account Details"}
                {currentStep === 3 && "Role Selection"}
              </h2>
              <p className="text-gray-600">
                {currentStep === 1 && "Let's start with your basic information"}
                {currentStep === 2 && "Create your login credentials"}
                {currentStep === 3 && "Choose your role in the system"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                          required
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                          required
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Account Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                        required
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Role Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(roleCategories).map(([category, roles]) => (
                      <div key={category} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
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
                                checked={formData.role === role.value}
                                onChange={handleChange}
                                className="sr-only"
                              />
                              <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                formData.role === role.value
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 bg-white/50 hover:border-gray-300'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-800">{role.label}</h4>
                                    <p className="text-sm text-gray-600">{role.description}</p>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 ${
                                    formData.role === role.value
                                      ? 'border-emerald-500 bg-emerald-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {formData.role === role.value && (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? 'invisible'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !isStepValid()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
            </form>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
              
              {/* Security Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">Secure Registration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 CareWave. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}