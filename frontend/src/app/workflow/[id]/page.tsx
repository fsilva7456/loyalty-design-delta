"use client";

import { useEffect } from 'react';
import { startWorkflow } from '@/services/api';
import StepForm from '@/components/StepForm';
import StepNavigator from '@/components/StepNavigator';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { toast } from 'react-hot-toast';
import { StepResult } from '@/types/api';

type WorkflowStep = 
  | 'competitor_analysis'
  | 'customer_analysis'
  | 'loyalty_objectives'
  | 'loyalty_mechanics'
  | 'cost_estimation'
  | 'performance_simulation'
  | 'business_case';

export default function WorkflowPage({ params }: { params: { id: string } }) {
  const { state, dispatch } = useWorkflow();

  useEffect(() => {
    const initializeWorkflow = async () => {
      if (!state.workflowId) {
        try {
          const result = await startWorkflow();
          dispatch({ type: 'SET_WORKFLOW_ID', payload: result.workflow_id });
          console.log('New workflow started:', result);
        } catch (error) {
          console.error('Error initializing workflow:', error);
          toast.error('Failed to initialize workflow');
          dispatch({ 
            type: 'SET_ERROR', 
            payload: error instanceof Error ? error.message : 'Failed to initialize workflow'
          });
        }
      }
    };

    initializeWorkflow();
  }, [params.id, state.workflowId, dispatch]);

  const getCurrentStep = (): WorkflowStep => {
    const steps: WorkflowStep[] = [
      'competitor_analysis',
      'customer_analysis',
      'loyalty_objectives',
      'loyalty_mechanics',
      'cost_estimation',
      'performance_simulation',
      'business_case'
    ];

    // Find the first step without a result
    const nextStep = steps.find(step => !state.stepResults[step]);
    return nextStep || steps[0];
  };

  const currentStep = getCurrentStep();
  const currentStepResult = state.stepResults[currentStep] as StepResult;

  const getCompletedSteps = () => {
    return Object.keys(state.stepResults) as WorkflowStep[];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <StepNavigator
            currentStep={currentStep}
            completedSteps={getCompletedSteps()}
            isLoading={state.isLoading}
          />

          <StepForm
            step={currentStep}
            result={currentStepResult}
            previousStepResults={state.stepResults}
          />

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium text-gray-900">Debug Info</h3>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {JSON.stringify({
                  currentStep,
                  workflowState: state,
                  params
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}