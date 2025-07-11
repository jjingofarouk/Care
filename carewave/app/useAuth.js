"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from './authUtils';
import { login, logout } from './authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  return { user, loading, login: handleLogin, logout: handleLogout, refreshUser };
};

export default useAuth;