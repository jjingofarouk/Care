// auth.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from './auth/authUtils';
import { login, logout } from './auth/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const storedUser = getUser();
    if (storedUser && isAuthenticated()) {
      setUser(storedUser);
    } else {
      setUser(null);
      await logout();
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    refreshUser();
    const interval = setInterval(refreshUser, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  const handleLogin = async (credentials) => {
    try {
      const { user } = await login(credentials);
      setUser(user);
      router.push('/appointments');
      return user;
    } catch (error) {
      throw new Error('Login failed');
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