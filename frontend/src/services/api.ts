import { WorkflowResponse } from '@/types/workflow';
import { APIResponse, BaseStepPayload, StepResult } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL is not configured');
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'An error occurred');
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export const startWorkflow = async (): Promise<WorkflowResponse> => {
  const { data, error } = await fetchAPI<WorkflowResponse>('/start_workflow', {
    method: 'POST',
  });

  if (error || !data) throw new Error(error || 'Failed to start workflow');
  return data;
};

export const executeStep = async <T extends StepResult>(stepName: string, payload: BaseStepPayload): Promise<T> => {
  const { data, error } = await fetchAPI<T>(`/step/${stepName}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (error || !data) throw new Error(error || 'Failed to execute step');
  return data;
};
