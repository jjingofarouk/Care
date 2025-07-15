"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Update user state from session
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
    setIsInitialized(true);
  }, [session, status]);

  const handleLogin = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // User is set via useEffect after successful sign-in
      const user = session?.user;
      if (user) {
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
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  }, [router, session]);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogoutAllDevices = useCallback(async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout all devices error:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const hasRole = useCallback((requiredRole) => {
    return user?.role === requiredRole;
  }, [user]);

  const hasAnyRole = useCallback((requiredRoles) => {
    return user?.role && requiredRoles.includes(user.role);
  }, [user]);

  const isUserAuthenticated = useCallback(() => {
    return !!user && status === 'authenticated';
  }, [user, status]);

  const value = {
    user,
    loading,
    isInitialized,
    login: handleLogin,
    logout: handleLogout,
    logoutAllDevices: handleLogoutAllDevices,
    refreshUser: () => {}, // No-op since NextAuth.js handles session refresh
    hasValidSession: isUserAuthenticated,
    isAuthenticated: isUserAuthenticated,
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

export const useRoleAuth = (requiredRole) => {
  const { user, hasRole, isAuthenticated } = useAuth();

  return {
    user,
    isAuthenticated,
    hasRequiredRole: hasRole(requiredRole),
    canAccess: isAuthenticated && hasRole(requiredRole),
  };
};

export const useMultiRoleAuth = (requiredRoles) => {
  const { user, hasAnyRole, isAuthenticated } = useAuth();

  return {
    user,
    isAuthenticated,
    hasAnyRequiredRole: hasAnyRole(requiredRoles),
    canAccess: isAuthenticated && hasAnyRole(requiredRoles),
  };
};