import { StepResult } from './api';

export interface WorkflowResponse {
  workflow_id: string;
  created_at?: string;
}

export interface WorkflowState {
  workflowId: string | null;
  stepResults: Record<string, StepResult>;
  businessCase: any | null;
  isLoading: boolean;
  error: string | null;
}

export type WorkflowAction = 
  | { type: 'SET_WORKFLOW_ID'; payload: string }
  | { type: 'SET_STEP_RESULT'; payload: { step: string; result: StepResult } }
  | { type: 'SET_BUSINESS_CASE'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
