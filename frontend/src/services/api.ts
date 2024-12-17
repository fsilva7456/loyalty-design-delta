import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL is not configured');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
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

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const startWorkflow = async () => {
  try {
    const response = await api.post('/start_workflow');
    return response.data;
  } catch (error) {
    console.error('Error starting workflow:', error);
    throw new Error('Failed to start workflow');
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

    // Handle regeneration requests specifically
    if (stepName.endsWith('/regenerate')) {
      const regenerationPayload: RegenerationPayload = {
        workflow_id: payload.workflow_id,
        user_feedback: payload.feedback || payload.user_feedback,  // Handle both for backwards compatibility
        previous_result: payload.previous_result
      };
      console.log('Regeneration payload:', regenerationPayload);
      const response = await api.post(`/step/${stepName}`, regenerationPayload);
      return response.data;
    }

    // Handle normal requests
    const response = await api.post(`/step/${stepName}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Error executing step ${stepName}:`, {
      error,
      response: error.response?.data,
      config: error.config
    });

    // Network or configuration errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    // API errors
    const errorMessage = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
};

export const getBusinessCase = async (payload: any) => {
  try {
    const response = await api.post('/step/business_case', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error getting business case:', error.response?.data || error);
    throw new Error(error.response?.data?.detail || 'Failed to get business case');
  }
};