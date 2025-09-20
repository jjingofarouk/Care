"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const requireAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };

  // Set a display name for the anonymous component
  AuthenticatedComponent.displayName = `RequireAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthenticatedComponent;
};
