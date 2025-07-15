"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, User, UserPlus, Eye, EyeOff, Shield, Heart, Stethoscope, Users, Settings, LogIn 
} from 'lucide-react';
import { login, register } from './authService';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
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
    const { name, value, type, checked } = e.target;
    setLoginData({ ...loginData, [name]: type === 'checkbox' ? checked : value });
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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-3xl shadow-2xl">
                <Heart className="w-12 h-12 text-white mx-auto" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
              CareWave
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              {isLogin ? 'Welcome back to your dashboard' : 'Join our healthcare community'}
            </p>
          </div>

          {/* Auth Toggle */}
          <div className="relative mb-8">
            <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-700/50">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <LogIn className="w-5 h-5 inline mr-2" />
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <UserPlus className="w-5 h-5 inline mr-2" />
                Register
              </button>
            </div>
          </div>

          {/* Main Form Container */}
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-slate-900/50 p-8">
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-slate-400">Sign in to access your dashboard</p>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-200" />
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-200" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        required
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onChange={handleLoginChange}
                        className="w-5 h-5 text-blue-500 border-slate-600 rounded focus:ring-blue-500 focus:ring-2 bg-slate-800"
                      />
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-200">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-red-400 font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    <span className="text-slate-400 text-sm bg-slate-800/50 px-4 py-2 rounded-full">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                  </div>
                  <p className="text-slate-400 mb-4">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                    >
                      Create Account
                    </button>
                  </p>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Secure Login
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                          step < currentStep ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-700'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Account Details"}
                    {currentStep === 3 && "Role Selection"}
                  </h2>
                  <p className="text-slate-400">
                    {currentStep === 1 && "Let's start with your basic information"}
                    {currentStep === 2 && "Create your login credentials"}
                    {currentStep === 3 && "Choose your role in the system"}
                  </p>
                </div>

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">First Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-200" />
                          <input
                            type="text"
                            name="firstName"
                            value={registerData.firstName}
                            onChange={handleRegisterChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                            required
                            placeholder="First name"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-200" />
                          <input
                            type="text"
                            name="lastName"
                            value={registerData.lastName}
                            onChange={handleRegisterChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                            required
                            placeholder="Last name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-200" />
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          required
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-200" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          required
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(roleCategories).map(([category, roles]) => (
                      <div key={category} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          {category === 'Patient Care' && <Stethoscope className="w-5 h-5 text-blue-400" />}
                          {category === 'Medical Services' && <Heart className="w-5 h-5 text-red-400" />}
                          {category === 'Administrative' && <Settings className="w-5 h-5 text-yellow-400" />}
                          {category === 'Support Staff' && <Users className="w-5 h-5 text-green-400" />}
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
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
                              <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                registerData.role === role.value
                                  ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                                  : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500/50 hover:bg-slate-700/30'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-white">{role.label}</h4>
                                    <p className="text-sm text-slate-400">{role.description}</p>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                                    registerData.role === role.value
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-slate-400'
                                  }`}>
                                    {registerData.role === role.value && (
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
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      currentStep === 1 
                        ? 'invisible' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading || !isStepValid()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-3"
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

                <div className="text-center mt-8">
                  <p className="text-slate-400 mb-4">
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  </p>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Secure Registration
                  </div>
                </div>
              </form>
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
}