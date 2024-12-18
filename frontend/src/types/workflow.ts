import { StepResult } from './api';

export interface WorkflowResponse {
  workflow_id: string;
  created_at?: string;
}

export type WorkflowStep = 
  | 'competitor_analysis'
  | 'customer_analysis'
  | 'loyalty_objectives'
  | 'loyalty_mechanics'
  | 'cost_estimation'
  | 'performance_simulation'
  | 'business_case';

export const WORKFLOW_STEPS: WorkflowStep[] = [
  'competitor_analysis',
  'customer_analysis',
  'loyalty_objectives',
  'loyalty_mechanics',
  'cost_estimation',
  'performance_simulation',
  'business_case'
];
