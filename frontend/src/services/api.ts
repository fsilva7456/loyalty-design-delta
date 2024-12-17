import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL is not configured');
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface APIError {
  detail: string;
  code?: string;
  correlation_id?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Retry logic
const retryRequest = async (fn: () => Promise<any>, retries: number = MAX_RETRIES): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

const isRetryableError = (error: any): boolean => {
  return (
    !error.response || // Network errors
    error.response.status >= 500 || // Server errors
    error.response.status === 429 // Rate limiting
  );
};

// Request interceptor
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      correlation_id: response.headers['x-correlation-id']
    });
    return response;
  },
  error => {
    const correlation_id = error.response?.headers?.['x-correlation-id'];
    console.error('API Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      correlation_id
    });

    // Handle CORS errors specifically
    if (error.message === 'Network Error') {
      toast.error('Unable to connect to the server. Please check your connection.');
      return Promise.reject(new Error('CORS or network error occurred'));
    }

    return Promise.reject(error);
  }
);

export const startWorkflow = async () => {
  try {
    return await retryRequest(async () => {
      const response = await api.post('/start_workflow');
      return response.data;
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    handleApiError(error);
    throw error;
  }
};

interface RegenerationPayload {
  workflow_id: string;
  user_feedback: string;
  previous_result: any;
}

export const executeStep = async (stepName: string, payload: any) => {
  try {
    console.log(`Executing step ${stepName} with payload:`, payload);
    
    // Validate API URL configuration
    if (!API_BASE_URL) {
      throw new Error('API URL is not configured. Please check your environment variables.');
    }

    return await retryRequest(async () => {
      // Handle regeneration requests specifically
      if (stepName.endsWith('/regenerate')) {
        const regenerationPayload: RegenerationPayload = {
          workflow_id: payload.workflow_id,
          user_feedback: payload.feedback || payload.user_feedback,
          previous_result: payload.previous_result
        };
        console.log('Regeneration payload:', regenerationPayload);
        const response = await api.post(`/step/${stepName}`, regenerationPayload);
        return response.data;
      }

      // Handle normal requests
      const response = await api.post(`/step/${stepName}`, payload);
      return response.data;
    });
  } catch (error) {
    console.error(`Error executing step ${stepName}:`, error);
    handleApiError(error);
    throw error;
  }
};

const handleApiError = (error: any) => {
  if (error.response?.data?.error) {
    const apiError = error.response.data.error as APIError;
    const message = apiError.detail || 'An unexpected error occurred';
    const correlationId = apiError.correlation_id;
    
    toast.error(
      correlationId 
        ? `${message} (Reference: ${correlationId})` 
        : message
    );
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
};

export const getBusinessCase = async (payload: any) => {
  try {
    return await retryRequest(async () => {
      const response = await api.post('/step/business_case', payload);
      return response.data;
    });
  } catch (error) {
    console.error('Error getting business case:', error);
    handleApiError(error);
    throw error;
  }
};