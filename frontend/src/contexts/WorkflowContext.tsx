"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface WorkflowState {
  workflowId: string | null;
  stepResults: Record<string, any>;
  businessCase: any | null;
  isLoading: boolean;
  error: string | null;
}

type WorkflowAction =
  | { type: 'SET_WORKFLOW_ID'; payload: string }
  | { type: 'SET_STEP_RESULT'; payload: { step: string; result: any } }
  | { type: 'SET_BUSINESS_CASE'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: WorkflowState = {
  workflowId: null,
  stepResults: {},
  businessCase: null,
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
        stepResults: { ...state.stepResults, [action.payload.step]: action.payload.result }
      };
    case 'SET_BUSINESS_CASE':
      return { ...state, businessCase: action.payload };
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

// Export both names for backward compatibility
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

export const useWorkflowContext = useWorkflow;