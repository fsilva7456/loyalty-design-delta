"use client";

import { useEffect, useState } from 'react';
import { startWorkflow, executeStep } from '@/services/api';
import StepForm from '@/components/StepForm';
import StepNavigator from '@/components/StepNavigator';
import { toast } from 'react-hot-toast';

interface WorkflowState {
  customer_analysis?: any;
  competitor_analysis?: any;
  loyalty_objectives?: any;
  loyalty_mechanics?: any;
  cost_estimation?: any;
}

export default function WorkflowPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState('customer_analysis');
  const [workflowState, setWorkflowState] = useState<WorkflowState>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeWorkflow = async () => {
      try {
        if (!params.id) {
          const result = await startWorkflow();
          // Handle workflow initialization
          console.log('New workflow started:', result);
        }
      } catch (error) {
        console.error('Error initializing workflow:', error);
        toast.error('Failed to initialize workflow');
      }
    };

    initializeWorkflow();
  }, [params.id]);

  const handleStepSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log(`Submitting ${currentStep} data:`, data);
      
      const result = await executeStep(currentStep, {
        workflow_id: params.id,
        ...data
      });

      console.log(`${currentStep} result:`, result);
      
      setWorkflowState(prev => ({
        ...prev,
        [currentStep]: result
      }));

      toast.success('Analysis completed successfully');
    } catch (error) {
      console.error(`Error in ${currentStep}:`, error);
      toast.error('Failed to complete analysis');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (feedback: string) => {
    setIsLoading(true);
    try {
      console.log(`Regenerating ${currentStep} with feedback:`, feedback);
      
      const previousResult = workflowState[currentStep];
      if (!previousResult) {
        throw new Error('No previous result found for regeneration');
      }

      const result = await executeStep(`${currentStep}/regenerate`, {
        workflow_id: params.id,
        user_feedback: feedback,
        previous_result: previousResult
      });

      console.log(`${currentStep} regeneration result:`, result);
      
      setWorkflowState(prev => ({
        ...prev,
        [currentStep]: result
      }));

      toast.success('Analysis regenerated successfully');
    } catch (error) {
      console.error(`Error regenerating ${currentStep}:`, error);
      toast.error('Failed to regenerate analysis');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPreviousStepResults = () => {
    // Filter out current step from previous results
    const { [currentStep]: _, ...previousResults } = workflowState;
    return previousResults;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Step Navigation */}
          <StepNavigator
            currentStep={currentStep}
            completedSteps={Object.keys(workflowState)}
            onStepChange={setCurrentStep}
            isLoading={isLoading}
          />

          {/* Current Step Form/Result */}
          <StepForm
            step={currentStep}
            onSubmit={handleStepSubmit}
            onRegenerate={handleRegenerate}
            result={workflowState[currentStep]}
            previousStepResults={getPreviousStepResults()}
          />

          {/* Debug Information (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium text-gray-900">Debug Info</h3>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {JSON.stringify({
                  currentStep,
                  workflowState,
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
