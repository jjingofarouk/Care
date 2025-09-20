import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useApiData(fetchFunction, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to continue');
          router.push('/login');
          return;
        }
        const response = await fetchFunction();
        setData(Array.isArray(response) ? response.filter((item) => item && item.id) : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('API fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, dependencies);

  return { data, loading, error };
}