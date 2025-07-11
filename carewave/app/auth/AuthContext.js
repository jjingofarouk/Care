"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { login, logout } from './authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const storedUser = getUser();
    const token = localStorage.getItem('token');
    if (storedUser && isAuthenticated(token)) {
      setUser(storedUser);
    } else {
      setUser(null);
      await logout();
      router.push('/auth');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogin = async (credentials) => {
    try {
      const { user } = await login(credentials);
      setUser(user);
      router.push('/appointment');
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};