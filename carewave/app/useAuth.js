"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, hasValidSession, getToken, getRefreshToken } from './auth/authUtils';
import { login, logout, logoutAllDevices, refreshAccessToken, setupTokenRefresh } from './auth/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    setLoading(true);
    
    try {
      const token = getToken();
      const refreshToken = getRefreshToken();
      
      if (!hasValidSession()) {
        setUser(null);
        await logout();
        setLoading(false);
        setIsInitialized(true);
        return;
      }
      
      if (!isAuthenticated(token) && refreshToken) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          setUser(null);
          await logout();
          setLoading(false);
          setIsInitialized(true);
          return;
        }
      }
      
      const storedUser = getUser();
      setUser(storedUser);
      
      setupTokenRefresh();
      
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      await logout();
    }
    
    setLoading(false);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      refreshUser();
    }
  }, [refreshUser, isInitialized]);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const { user } = await login(credentials);
      setUser(user);
      
      switch (user.role) {
        case 'ADMIN':
        case 'HOSPITAL_MANAGER':
          router.push('/dashboard');
          break;
        case 'DOCTOR':
        case 'NURSE':
          router.push('/patients');
          break;
        case 'RECEPTIONIST':
          router.push('/appointments');
          break;
        default:
          router.push('/appointment');
      }
      
      return user;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setLoading(true);
      await logoutAllDevices();
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout all devices error:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    return user?.role && requiredRoles.includes(user.role);
  };

  const isUserAuthenticated = () => {
    return !!user && hasValidSession();
  };

  return {
    user,
    loading,
    isInitialized,
    login: handleLogin,
    logout: handleLogout,
    logoutAllDevices: handleLogoutAllDevices,
    refreshUser,
    hasValidSession: hasValidSession(),
    isAuthenticated: isUserAuthenticated(),
    hasRole,
    hasAnyRole,
  };
};

export default useAuth;