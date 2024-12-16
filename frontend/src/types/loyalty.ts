export interface CustomerSegment {
  segment_name: string;
  segment_size: number;
  spend_potential: number;
  churn_risk: number;
}

export interface MechanicsPreferences {
  selected_mechanics: string[];
  custom_preferences?: string;
}

export interface LoyaltyMechanic {
  mechanic: string;
  description: string;
  alignment: string;
}

export interface LoyaltyMechanicsFormData {
  workflow_id: string;
  customer_segments: CustomerSegment[];
  objectives: string[];
  mechanics_preferences: MechanicsPreferences;
}

export interface LoyaltyMechanicsResponse {
  workflow_id: string;
  mechanics: LoyaltyMechanic[];
  insights: string;
}

export interface WorkflowStep {
  customer_analysis?: {
    segments: CustomerSegment[];
  };
  loyalty_objectives?: {
    objectives: string[];
  };
  loyalty_mechanics?: {
    mechanics: LoyaltyMechanic[];
    insights: string;
    preferences: MechanicsPreferences;
  };
}