"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { login, logout, refreshToken } from './authService';

export const useAuth = () => {
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
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && isAuthenticated(accessToken)) {
      setUser(storedUser);
      setLoading(false);
      return;
    }

    try {
      const { user } = await refreshToken();
      setUser(user);
    } catch (error) {
      setUser(null);
      await logout();
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogin = async (credentials) => {
    try {
      const { user } = await login(credentials);
      setUser(user);
      router.push('/appointments');
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

  return { user, loading, login: handleLogin, logout: handleLogout, refreshUser };
};

export default useAuth;