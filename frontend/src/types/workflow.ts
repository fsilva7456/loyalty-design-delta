import { StepResult } from './api';

export interface WorkflowResponse {
  workflow_id: string;
  created_at?: string;
}

export const WORKFLOW_STEPS = [
  'competitor_analysis',
  'customer_analysis',
  'loyalty_objectives',
  'loyalty_mechanics',
  'cost_estimation',
  'performance_simulation',
  'business_case'
] as const;

export type WorkflowStep = typeof WORKFLOW_STEPS[number];

export const STEP_LABELS: Record<WorkflowStep, string> = {
  competitor_analysis: 'Competitor Analysis',
  customer_analysis: 'Customer Analysis',
  loyalty_objectives: 'Loyalty Objectives',
  loyalty_mechanics: 'Loyalty Mechanics',
  cost_estimation: 'Cost Estimation',
  performance_simulation: 'Performance Simulation',
  business_case: 'Business Case'
};

// Helper functions for step navigation
export const getNextStep = (currentStep: WorkflowStep): WorkflowStep | null => {
  const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === WORKFLOW_STEPS.length - 1) {
    return null;
  }
  return WORKFLOW_STEPS[currentIndex + 1];
};

export const getPreviousStep = (currentStep: WorkflowStep): WorkflowStep | null => {
  const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return WORKFLOW_STEPS[currentIndex - 1];
};

export const isStepAvailable = (
  step: WorkflowStep,
  currentStep: WorkflowStep,
  completedSteps: WorkflowStep[]
): boolean => {
  const stepIndex = WORKFLOW_STEPS.indexOf(step);
  const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);

  // Step is available if:
  // 1. It's already completed
  // 2. It's the current step
  // 3. It's the next step and all previous steps are completed
  return (
    completedSteps.includes(step) ||
    step === currentStep ||
    (stepIndex === currentIndex + 1 && 
      WORKFLOW_STEPS.slice(0, stepIndex).every(s => completedSteps.includes(s)))
  );
};
