export interface WorkflowResponse {
  workflow_id: string;
  created_at?: string;
}

export interface WorkflowState {
  workflow_id: string | null;
  isLoading: boolean;
  error: string | null;
}

export type WorkflowAction = 
  | { type: 'SET_WORKFLOW_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
