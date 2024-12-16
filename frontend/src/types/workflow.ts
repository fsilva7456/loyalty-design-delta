export interface Workflow {
  id: string;
  steps: {
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'in_progress';
  data?: any;
}