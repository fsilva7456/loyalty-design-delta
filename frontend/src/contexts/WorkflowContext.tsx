"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface WorkflowState {
  workflowId: string | null;
  stepResults: Record<string, any>;
  businessCase: any | null;
}

type WorkflowAction =
  | { type: 'SET_WORKFLOW_ID'; payload: string }
  | { type: 'SET_STEP_RESULT'; payload: { step: string; result: any } }
  | { type: 'SET_BUSINESS_CASE'; payload: any };

const initialState: WorkflowState = {
  workflowId: null,
  stepResults: {},
  businessCase: null,
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

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
