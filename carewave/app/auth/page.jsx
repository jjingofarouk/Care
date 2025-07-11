"use client";

import React, { useState } from 'react';
import { Heart, Shield, Users, Activity } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--hospital-gray-50)] via-[var(--hospital-white)] to-[var(--hospital-gray-100)] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--hospital-accent)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[var(--hospital-accent-light)] rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 pr-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[var(--hospital-accent)] rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--hospital-gray-900)]">
                  Hospital<span className="text-[var(--hospital-accent)]">Care</span>
                </h1>
                <p className="text-[var(--hospital-gray-600)]">Healthcare Management System</p>
              </div>
            </div>
            
            <p className="text-lg text-[var(--hospital-gray-700)] leading-relaxed">
              Secure, efficient, and comprehensive healthcare management for modern medical facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[var(--hospital-accent)]/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[var(--hospital-accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--hospital-gray-900)] mb-1">Secure & Compliant</h3>
                <p className="text-[var(--hospital-gray-600)] text-sm">HIPAA compliant with end-to-end encryption</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[var(--hospital-accent)]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--hospital-accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--hospital-gray-900)] mb-1">Multi-Role Access</h3>
                <p className="text-[var(--hospital-gray-600)] text-sm">Tailored interfaces for patients, doctors, and staff</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[var(--hospital-accent)]/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[var(--hospital-accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--hospital-gray-900)] mb-1">Real-Time Monitoring</h3>
                <p className="text-[var(--hospital-gray-600)] text-sm">Live patient data and system analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full">
          <div className="card max-w-md mx-auto animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-[var(--hospital-accent)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">
                Hospital<span className="text-[var(--hospital-accent)]">Care</span>
              </h1>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-[var(--hospital-gray-600)]">
                {isLogin 
                  ? 'Sign in to access your healthcare dashboard' 
                  : 'Join our healthcare management system'
                }
              </p>
            </div>

            {/* Auth Form */}
            <div className="space-y-6">
              {isLogin ? <LoginForm /> : <RegisterForm />}
              
              {/* Toggle Button */}
              <div className="text-center pt-6 border-t border-[var(--hospital-gray-200)]">
                <p className="text-[var(--hospital-gray-600)] mb-2">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="btn btn-outline w-full"
                >
                  {isLogin ? 'Create New Account' : 'Sign In Instead'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-[var(--hospital-gray-500)]">
            <p>© 2024 HospitalCare. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="hover:text-[var(--hospital-accent)] transition-colors">
                Privacy Policy
              </button>
              <span>•</span>
              <button className="hover:text-[var(--hospital-accent)] transition-colors">
                Terms of Service
              </button>
              <span>•</span>
              <button className="hover:text-[var(--hospital-accent)] transition-colors">
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}