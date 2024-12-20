import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startWorkflow = async () => {
  try {
    const response = await api.post('/start_workflow');
    return response.data;
  } catch (error) {
    console.error('Error starting workflow:', error);
    throw new Error('Failed to start workflow');
  }
};

export const executeStep = async (stepName: string, payload: any) => {
  try {
    console.log(`Executing step ${stepName} with payload:`, payload);
    const response = await api.post(`/step/${stepName}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Error executing step ${stepName}:`, error.response?.data || error);
    throw new Error(error.response?.data?.detail || 'Failed to execute step');
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
