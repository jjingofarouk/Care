// /lib/auth/AuthContext.js
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { login, logout, logoutAllDevices, refreshAccessToken, setupTokenRefresh } from './authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
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

  const hasValidSession = () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If we have a valid access token, we're good
    if (isAuthenticated(token)) {
      return true;
    }
    
    // If access token is expired/missing but we have a refresh token, assume valid
    // The server will validate it when we try to refresh
    if (refreshToken && !isAuthenticated(token)) {
      return true;
    }
    
    return false;
  };

  const getUser = () => {
    if (typeof window === 'undefined') return null;
    
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const refreshUser = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!hasValidSession()) {
        // No valid session, clear everything
        setUser(null);
        await logout();
        setLoading(false);
        setIsInitialized(true);
        return;
      }
      
      // If access token is expired/missing but refresh token exists, try to refresh
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
      
      // Set user from localStorage
      const storedUser = getUser();
      setUser(storedUser);
      
      // Set up automatic token refresh
      setupTokenRefresh();
      
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      await logout();
    }
    
    setLoading(false);
    setIsInitialized(true);
  }, []);

  // Initialize authentication state
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
      
      // Redirect based on user role
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

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (requiredRoles) => {
    return user?.role && requiredRoles.includes(user.role);
  };

  // Check if user is authenticated
  const isUserAuthenticated = () => {
    return !!user && hasValidSession();
  };

  const value = {
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

  return (
    <AuthContext.Provider value={value}>
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

// Custom hook for role-based access
export const useRoleAuth = (requiredRole) => {
  const { user, hasRole, isAuthenticated } = useAuth();
  
  return {
    user,
    isAuthenticated,
    hasRequiredRole: hasRole(requiredRole),
    canAccess: isAuthenticated && hasRole(requiredRole),
  };
};

// Custom hook for multi-role access
export const useMultiRoleAuth = (requiredRoles) => {
  const { user, hasAnyRole, isAuthenticated } = useAuth();
  
  return {
    user,
    isAuthenticated,
    hasAnyRequiredRole: hasAnyRole(requiredRoles),
    canAccess: isAuthenticated && hasAnyRole(requiredRoles),
  };
};