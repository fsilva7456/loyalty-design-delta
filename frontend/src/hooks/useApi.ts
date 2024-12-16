import axios from 'axios';
import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleRequest = async (request: Promise<any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await request;
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    get: (url: string) => handleRequest(api.get(url)),
    post: (url: string, data: any) => handleRequest(api.post(url, data)),
    put: (url: string, data: any) => handleRequest(api.put(url, data)),
    delete: (url: string) => handleRequest(api.delete(url)),
    isLoading,
    error,
  };
};