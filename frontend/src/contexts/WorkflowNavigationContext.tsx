"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface WorkflowNavigationContextType {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  navigateToStep: (id: string, step: string) => void;
}

const WorkflowNavigationContext = createContext<WorkflowNavigationContextType | undefined>(undefined);

export function WorkflowNavigationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<string>('');

  const navigateToStep = (id: string, step: string) => {
    setCurrentStep(step);
    window.location.href = `/workflow/${id}/${step}`;
  };

  return (
    <WorkflowNavigationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        navigateToStep
      }}
    >
      {children}
    </WorkflowNavigationContext.Provider>
  );
}

export function useWorkflowNavigation() {
  const context = useContext(WorkflowNavigationContext);
  if (!context) {
    throw new Error('useWorkflowNavigation must be used within a WorkflowNavigationProvider');
  }
  return context;
}