"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { StepResult } from '@/types/api';

export interface WorkflowState {
  workflowId: string | null;
  stepResults: Record<string, StepResult>;
  businessCase: any | null;
  companyName: string;
  industry: string;
  isLoading: boolean;
  error: string | null;
}

export type WorkflowAction =
  | { type: 'SET_WORKFLOW_ID'; payload: string }
  | { type: 'SET_STEP_RESULT'; payload: { step: string; result: StepResult } }
  | { type: 'SET_BUSINESS_CASE'; payload: any }
  | { type: 'SET_COMPANY_INFO'; payload: { companyName: string; industry: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: WorkflowState = {
  workflowId: null,
  stepResults: {},
  businessCase: null,
  companyName: '',
  industry: '',
  isLoading: false,
  error: null,
};

const WorkflowContext = createContext<{
  state: WorkflowState;
  dispatch: React.Dispatch<WorkflowAction>;
}>({ state: initialState, dispatch: () => null });

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'SET_WORKFLOW_ID':
      return { ...state, workflowId: action.payload };
    
    case 'SET_STEP_RESULT':
      return {
        ...state,
        stepResults: { 
          ...state.stepResults, 
          [action.payload.step]: action.payload.result 
        }
      };
    
    case 'SET_BUSINESS_CASE':
      return { ...state, businessCase: action.payload };
    
    case 'SET_COMPANY_INFO':
      return { 
        ...state, 
        companyName: action.payload.companyName,
        industry: action.payload.industry 
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  );
}

// Custom hook to use workflow context
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
