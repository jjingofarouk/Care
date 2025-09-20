import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import authService from './authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getUser());
    } else {
      setUser(null);
      authService.logout();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    router.push('/appointments');
    return data.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: authService.isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};