// /lib/auth/authUtils.js
"use client";
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { refreshAccessToken } from './authService';

export const isAuthenticated = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const hasValidSession = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  // If we have a valid access token, we're good
  if (isAuthenticated(token)) {
    return true;
  }
  
  // If access token is expired/missing but we have a refresh token, check if it exists
  if (refreshToken && !isAuthenticated(token)) {
    // We can't decode the refresh token since it's a UUID, but if it exists, assume valid
    // The server will validate it when we try to refresh
    return true;
  }
  
  return false;
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('token');
};

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('refreshToken');
};

// Check if token is about to expire (within 5 minutes)
export const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Return true if token expires in less than 5 minutes
    return timeUntilExpiry < 300; // 5 minutes
  } catch {
    return true;
  }
};

export const requireAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!hasValidSession()) {
          // Clear invalid tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/auth');
          return;
        }
        
        // If access token is expired/missing but refresh token exists, try to refresh
        if (!isAuthenticated(token) && refreshToken) {
          try {
            await refreshAccessToken();
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear tokens and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/auth');
          }
        }
        
        // If token is about to expire, refresh it proactively
        if (isAuthenticated(token) && isTokenExpiringSoon(token) && refreshToken) {
          try {
            await refreshAccessToken();
          } catch (error) {
            console.warn('Proactive token refresh failed:', error);
          }
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `RequireAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthenticatedComponent;
};

// Utility function to clear all auth data
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear any existing refresh timers
  if (window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }
};

// Utility function to check if user has specific role
export const hasRole = (requiredRole) => {
  const user = getUser();
  if (!user) return false;
  
  return user.role === requiredRole;
};

// Utility function to check if user has any of the specified roles
export const hasAnyRole = (requiredRoles) => {
  const user = getUser();
  if (!user) return false;
  
  return requiredRoles.includes(user.role);
};

// Higher-order component for role-based access control
export const requireRole = (requiredRole) => (WrappedComponent) => {
  const RoleAuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkRoleAuth = async () => {
        // First check if user is authenticated
        if (!hasValidSession()) {
          router.push('/auth');
          return;
        }
        
        // Then check if user has required role
        if (!hasRole(requiredRole)) {
          router.push('/unauthorized'); // You might want to create this page
          return;
        }
      };

      checkRoleAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  RoleAuthenticatedComponent.displayName = `RequireRole(${requiredRole})(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return RoleAuthenticatedComponent;
};