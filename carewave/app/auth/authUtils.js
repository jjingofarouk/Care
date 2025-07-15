import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const isAuthenticated = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return false;
  }
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const requireAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (!isAuthenticated(accessToken)) {
        router.push('/auth');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `RequireAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthenticatedComponent;
};