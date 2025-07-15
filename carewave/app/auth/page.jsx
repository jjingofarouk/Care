"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Shield, CheckCircle, Stethoscope, Users, Settings, LogIn } from 'lucide-react';
import { login, register } from './authService';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' });
  const [registerFormData, setRegisterFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', role: 'PATIENT',
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
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRegisterChange = (e) => {
    setRegisterFormData({ ...registerFormData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(loginFormData);
      router.push('/appointments');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) return;
    setIsLoading(true);
    setError(null);
    try {
      await register(registerFormData);
      setIsLogin(true);
      setCurrentStep(1);
      setRegisterFormData({ email: '', password: '', firstName: '', lastName: '', role: 'PATIENT' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (isStepValid() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return registerFormData.firstName && registerFormData.lastName;
      case 2:
        return registerFormData.email && registerFormData.password;
      case 3:
        return registerFormData.role;
      default:
        return false;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50 px-4 py-8">
      <motion.div
        className="w-full max-w-lg card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center mb-8">
                <h2 className="card-title">Welcome Back</h2>
                <p className="card-subtitle">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-hospital-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 w-5 h-5 transition-colors group-focus-within:text-hospital-accent" />
                    <input
                      type="email"
                      name="email"
                      value={loginFormData.email}
                      onChange={handleLoginChange}
                      className="input w-full pl-12"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-hospital-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 w-5 h-5 transition-colors group-focus-within:text-hospital-accent" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={loginFormData.password}
                      onChange={handleLoginChange}
                      className="input w-full pl-12 pr-12"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 hover:text-hospital-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="alert alert-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-hospital-error rounded-full"></div>
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-hospital-accent border-hospital-gray-300 rounded focus:ring-hospital-accent focus:ring-2"
                    />
                    <span className="text-sm text-hospital-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-hospital-accent hover:text-hospital-accent-dark font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center mt-6">
                <p className="text-hospital-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setError(null);
                    }}
                    className="text-hospital-accent hover:text-hospital-accent-dark font-semibold transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step <= currentStep
                          ? 'bg-hospital-accent text-hospital-white'
                          : 'bg-hospital-gray-200 text-hospital-gray-500'
                      }`}
                      animate={{ scale: step === currentStep ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                    </motion.div>
                    {step < 3 && (
                      <div
                        className={`w-24 h-1 mx-4 ${
                          step < currentStep ? 'bg-hospital-accent' : 'bg-hospital-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mb-8">
                <h2 className="card-title">
                  {currentStep === 1 && 'Personal Information'}
                  {currentStep === 2 && 'Account Details'}
                  {currentStep === 3 && 'Role Selection'}
                </h2>
                <p className="card-subtitle">
                  {currentStep === 1 && 'Enter your basic information'}
                  {currentStep === 2 && 'Create your login credentials'}
                  {currentStep === 3 && 'Choose your role in the system'}
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-hospital-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 w-5 h-5 transition-colors group-focus-within:text-hospital-accent" />
                          <input
                            type="text"
                            name="firstName"
                            value={registerFormData.firstName}
                            onChange={handleRegisterChange}
                            className="input w-full pl-12"
                            required
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-hospital-gray-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 w-5 h-5 transition-colors group-focus-within:text-hospital-accent" />
                          <input
                            type="text"
                            name="lastName"
                            value={registerFormData.lastName}
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
                      <label className="block text-sm font-semibold text-hospital-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 w-5 h-5 transition-colors group-focus-within:text-hospital-accent" />
                        <input
                          type="email"
                          name="email"
                          value={registerFormData.email}
                          onChange={handleRegisterChange}
                          className="input w-full pl-12"
                          required
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-hospital-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 w-5 h-5 transition-colors group-focus-within:text-hospital-accent" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={registerFormData.password}
                          onChange={handleRegisterChange}
                          className="input w-full pl-12 pr-12"
                          required
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-hospital-gray-400 hover:text-hospital-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(roleCategories).map(([category, roles]) => (
                        <div key={category} className="space-y-4">
                          <h3 className="text-lg font-semibold text-hospital-gray-800 flex items-center gap-2">
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
                                  checked={registerFormData.role === role.value}
                                  onChange={handleRegisterChange}
                                  className="sr-only"
                                />
                                <motion.div
                                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    registerFormData.role === role.value
                                      ? 'border-hospital-accent bg-hospital-accent-light/10'
                                      : 'border-hospital-gray-200 bg-hospital-white hover:border-hospital-gray-300'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-semibold text-hospital-gray-800">{role.label}</h4>
                                      <p className="text-sm text-hospital-gray-600">{role.description}</p>
                                    </div>
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 ${
                                        registerFormData.role === role.value
                                          ? 'border-hospital-accent bg-hospital-accent'
                                          : 'border-hospital-gray-300'
                                      }`}
                                    >
                                      {registerFormData.role === role.value && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <div className="w-2 h-2 bg-hospital-white rounded-full"></div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div
                    className="alert alert-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-hospital-error rounded-full"></div>
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="flex justify-between items-center pt-6">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className={`btn btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous
                  </motion.button>

                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="btn btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading || !isStepValid()}
                      className="btn btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Create Account
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>

              <div className="text-center mt-6">
                <p className="text-hospital-gray-600 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setCurrentStep(1);
                      setError(null);
                    }}
                    className="text-hospital-accent hover:text-hospital-accent-dark font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-hospital-success/10 border border-hospital-success rounded-full mt-6 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Shield className="w-4 h-4 text-hospital-success" />
          <span className="text-sm text-hospital-success font-medium">
            {isLogin ? 'Secure Login' : 'Secure Registration'}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}