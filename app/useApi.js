// useApi.js
'use client';
import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios(config);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  return { loading, error, request };
};

export default useApi;
