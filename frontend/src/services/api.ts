import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const startWorkflow = async () => {
  const response = await axios.post(`${API_BASE_URL}/start_workflow`);
  return response.data;
};

export const executeStep = async (stepName: string, payload: any) => {
  const response = await axios.post(`${API_BASE_URL}/step/${stepName}`, payload);
  return response.data;
};

export const getBusinessCase = async (payload: any) => {
  const response = await axios.post(`${API_BASE_URL}/step/business_case`, payload);
  return response.data;
};
