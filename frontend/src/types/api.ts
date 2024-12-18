// API Types
export interface APIResponse<T> {
  data?: T;
  error?: string;
}

// Step Payloads
export interface BaseStepPayload {
  workflow_id: string;
  company_name: string;
  industry: string;
}

export interface RegenerationPayload extends BaseStepPayload {
  user_feedback: string;
  previous_result: any;
}

// Step Results
export interface CompetitorAnalysisResult {
  competitors: Array<{
    name: string;
    program_name: string;
    key_features: string[];
    strengths: string[];
    weaknesses: string[];
  }>;
  market_insights: {
    trends: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface CustomerAnalysisResult {
  segments: Array<{
    name: string;
    description: string;
    characteristics: string[];
    preferences: string[];
    value_drivers: string[];
  }>;
  insights: {
    key_findings: string[];
    recommendations: string[];
  };
}

export interface LoyaltyObjectivesResult {
  objectives: Array<{
    category: string;
    description: string;
    metrics: string[];
    timeline: string;
  }>;
  alignment: {
    business_goals: string[];
    customer_needs: string[];
  };
}

export type StepResult =
  | CompetitorAnalysisResult
  | CustomerAnalysisResult
  | LoyaltyObjectivesResult
  | Record<string, any>;
