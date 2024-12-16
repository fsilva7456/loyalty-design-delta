import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface Workflow {
  id: string;
  steps: {
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export const useWorkflow = () => {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const { get, post } = useApi();

  const fetchWorkflow = async (workflowId: string) => {
    try {
      const data = await get(`/api/workflows/${workflowId}`);
      setWorkflow(data);
      return data;
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw error;
    }
  };

  const updateWorkflowStep = async (stepId: string, stepData: any) => {
    if (!workflow) {
      throw new Error('No active workflow');
    }

    try {
      const updatedData = await post(`/api/workflows/${workflow.id}/steps/${stepId}`, stepData);
      setWorkflow(prev => ({
        ...prev!,
        steps: {
          ...prev!.steps,
          [stepId]: stepData
        }
      }));
      return updatedData;
    } catch (error) {
      console.error('Error updating workflow step:', error);
      throw error;
    }
  };

  return {
    workflow,
    fetchWorkflow,
    updateWorkflowStep,
  };
};