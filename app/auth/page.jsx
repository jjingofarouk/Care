"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, Shield, LogIn, Activity, 
  Users, Building2, Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import authService from './authService';

export default function AuthPage() {
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/appointments');
    }
  }, [router]);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({ ...loginData, [name]: type === 'checkbox' ? checked : value });
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(loginData);
      router.push('/appointments');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Side - Sign In Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <motion.div className="text-center" variants={itemVariants}>
            <motion.div 
              className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-base text-gray-600">
              Sign in to your healthcare dashboard
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            variants={formVariants}
          >
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="block w-full pl-11 pr-3 py-3.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="block w-full pl-11 pr-11 py-3.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-all"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              {error && (
                <motion.div 
                  className="rounded-xl bg-red-50 border border-red-200 p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div 
                      className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in to Dashboard
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Security Footer */}
          <motion.div className="text-center" variants={itemVariants}>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant • SSL Encrypted • ISO 27001 Certified</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Background Image & Features */}
      <div 
        className="hidden lg:flex lg:w-1/2 xl:w-[45%] relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1668487827039-ec0bedd0eb85?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
        }}
      >
        {/* Teal overlay to enhance the teal theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 to-emerald-900/60"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 xl:px-12 text-white">
          <motion.div 
            className="max-w-md xl:max-w-lg text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Logo and Title */}
            <motion.div className="mb-8" variants={itemVariants}>
              <motion.div 
                className="flex items-center justify-center mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                  <Activity className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <motion.h1 
                className="text-4xl xl:text-5xl font-bold text-white mb-4"
                variants={itemVariants}
              >
                CareWave HMS
              </motion.h1>
              <motion.p 
                className="text-lg xl:text-xl text-gray-100"
                variants={itemVariants}
              >
                Enterprise Healthcare Management System
              </motion.p>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Building2, title: "Multi-Facility", desc: "Manage multiple locations" },
                { icon: Users, title: "Patient Portal", desc: "24/7 patient access" },
                { icon: Stethoscope, title: "Clinical Tools", desc: "Advanced diagnostics" },
                { icon: Shield, title: "Secure & Compliant", desc: "HIPAA certified" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10"
                  custom={index}
                  variants={featureVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <feature.icon className="w-6 h-6 text-white mb-2" />
                  <h3 className="text-white font-semibold mb-1 text-sm">{feature.title}</h3>
                  <p className="text-gray-200 text-xs">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Statistics */}
            <motion.div className="text-center" variants={itemVariants}>
              <div className="flex justify-center space-x-8 text-white">
                {[
                  { number: "500+", label: "Hospitals" },
                  { number: "1M+", label: "Patients" },
                  { number: "99.9%", label: "Uptime" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.p 
                      className="text-3xl font-bold"
                      animate={{ 
                        textShadow: ["0 0 0px rgba(255,255,255,0.5)", "0 0 10px rgba(255,255,255,0.8)", "0 0 0px rgba(255,255,255,0.5)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.number}
                    </motion.p>
                    <p className="text-sm text-gray-200">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}