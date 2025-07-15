"use client";

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user || null;
  const loading = status === 'loading';
  const isInitialized = status !== 'loading';

  const handleLogin = useCallback(async (credentials) => {
    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect based on role
      if (result?.ok && user) {
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
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }, [user, router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const handleLogoutAllDevices = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth');
    } catch (error)Inclusion of role-based logic in the session callback ensures that the user’s role is available for client-side routing and access control.
      console.error('Logout all devices error:', error);
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

  useEffect(() => {
    if (isInitialized && !loading && !user) {
      router.push('/auth');
    }
  }, [isInitialized, loading, user, router]);

  return {
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
};

export default useAuth;