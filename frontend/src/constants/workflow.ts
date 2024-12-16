export const WORKFLOW_STEPS = {
  COMPETITOR_ANALYSIS: 'competitor-analysis',
  CUSTOMER_ANALYSIS: 'customer-analysis',
  LOYALTY_OBJECTIVES: 'loyalty-objectives',
  LOYALTY_MECHANICS: 'loyalty-mechanics',
  COST_ESTIMATION: 'cost-estimation',
  PERFORMANCE_SIMULATION: 'performance-simulation',
  BUSINESS_CASE: 'business-case'
} as const;

export const STEP_ORDER = [
  WORKFLOW_STEPS.COMPETITOR_ANALYSIS,
  WORKFLOW_STEPS.CUSTOMER_ANALYSIS,
  WORKFLOW_STEPS.LOYALTY_OBJECTIVES,
  WORKFLOW_STEPS.LOYALTY_MECHANICS,
  WORKFLOW_STEPS.COST_ESTIMATION,
  WORKFLOW_STEPS.PERFORMANCE_SIMULATION,
  WORKFLOW_STEPS.BUSINESS_CASE
];

export function getNextStep(currentStep: string): string | undefined {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return STEP_ORDER[currentIndex + 1];
}

export function getPreviousStep(currentStep: string): string | undefined {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  return currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : undefined;
}

export function getWorkflowPath(id: string, step: string): string {
  return `/workflow/${id}/${step}`;
}