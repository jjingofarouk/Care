"use client";

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--hospital-gray-50)]">
      <h2 className="mb-6 text-3xl font-bold text-[var(--hospital-gray-900)]">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <p className="mt-4 text-sm text-[var(--hospital-gray-700)]">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[var(--hospital-accent)] hover:underline"
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}