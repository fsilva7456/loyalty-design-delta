"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { startWorkflow, executeStep } from '@/services/api';
import StepForm from '@/components/StepForm';
import StepNavigator from '@/components/StepNavigator';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { toast } from 'react-hot-toast';
import { 
  WorkflowStep, 
  WORKFLOW_STEPS,
  getNextStep, 
  isStepAvailable 
} from '@/types/workflow';
import type { BaseStepPayload, RegenerationPayload } from '@/types/api';

export default function WorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter();
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
    const completedSteps = Object.keys(state.stepResults) as WorkflowStep[];
    
    // If no steps completed, start with the first step
    if (completedSteps.length === 0) {
      return WORKFLOW_STEPS[0];
    }

    // Find the last completed step
    const lastCompletedStep = completedSteps.reduce((latest, step) => {
      const latestIndex = WORKFLOW_STEPS.indexOf(latest);
      const currentIndex = WORKFLOW_STEPS.indexOf(step);
      return currentIndex > latestIndex ? step : latest;
    }, completedSteps[0]);

    // Get the next step after the last completed one
    const nextStep = getNextStep(lastCompletedStep);
    
    // If there's no next step, we're done - stay on the last step
    return nextStep ?? lastCompletedStep;
  };

  const handleStepSubmit = async (formData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const payload: BaseStepPayload = {
        workflow_id: params.id,
        company_name: state.companyName,
        industry: state.industry,
        ...formData
      };

      console.log(`Executing ${currentStep} with payload:`, payload);
      const result = await executeStep(currentStep, payload);
      
      dispatch({
        type: 'SET_STEP_RESULT',
        payload: { step: currentStep, result }
      });

      // After successful submission, check if we should move to next step
      const nextStep = getNextStep(currentStep);
      if (nextStep) {
        toast.success(`${currentStep} completed - moving to ${nextStep}`);
      } else {
        toast.success('All steps completed!');
        router.push(`/workflow/${params.id}/results`);
      }
    } catch (error) {
      console.error(`Error executing ${currentStep}:`, error);
      toast.error('Failed to complete step');
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to complete step'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleRegenerate = async (feedback: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const payload: RegenerationPayload = {
        workflow_id: params.id,
        company_name: state.companyName,
        industry: state.industry,
        user_feedback: feedback,
        previous_result: state.stepResults[currentStep]
      };

      console.log(`Regenerating ${currentStep} with payload:`, payload);
      const result = await executeStep(`${currentStep}/regenerate`, payload);
      
      dispatch({
        type: 'SET_STEP_RESULT',
        payload: { step: currentStep, result }
      });

      toast.success('Step regenerated successfully');
    } catch (error) {
      console.error(`Error regenerating ${currentStep}:`, error);
      toast.error('Failed to regenerate step');
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to regenerate step'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const currentStep = getCurrentStep();
  const completedSteps = Object.keys(state.stepResults) as WorkflowStep[];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <StepNavigator
            currentStep={currentStep}
            completedSteps={completedSteps}
            isLoading={state.isLoading}
          />

          <StepForm
            step={currentStep}
            onSubmit={handleStepSubmit}
            onRegenerate={handleRegenerate}
            result={state.stepResults[currentStep]}
            previousStepResults={state.stepResults}
          />

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium text-gray-900">Debug Info</h3>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {JSON.stringify({
                  currentStep,
                  completedSteps,
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