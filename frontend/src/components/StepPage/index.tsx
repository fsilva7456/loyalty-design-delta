"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { executeStep } from '@/services/api';
import { useWorkflow } from '@/contexts/WorkflowContext';
import StepNavigator from '@/components/StepNavigator';
import StepForm from '@/components/StepForm';

export default function StepPage() {
  const router = useRouter();
  const params = useParams();
  const { state, dispatch } = useWorkflow();
  const [currentStep, setCurrentStep] = useState('competitor_analysis');
  const [stepResult, setStepResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    'competitor_analysis',
    'customer_analysis',
    'loyalty_objectives',
    'loyalty_mechanics',
    'cost_estimation',
    'performance_simulation',
    'business_case'
  ];

  useEffect(() => {
    // Debug logs
    console.log('Current step:', currentStep);
    console.log('Workflow state:', state);
    console.log('Params:', params);
  }, [currentStep, state, params]);

  const handleStepSubmit = async (formData: any) => {
    setError('');
    setLoading(true);

    try {
      // Always include workflow_id from params
      const payload = {
        workflow_id: params.id,
        ...formData
      };

      console.log(`Submitting ${currentStep} with payload:`, payload);

      const result = await executeStep(currentStep, payload);
      console.log(`${currentStep} result:`, result);
      
      setStepResult(result);
      dispatch({
        type: 'SET_STEP_RESULT',
        payload: { step: currentStep, result }
      });
    } catch (error: any) {
      console.error(`Error executing step ${currentStep}:`, error);
      setError(error.message || 'An error occurred while processing your request');
      setStepResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setStepResult(null);
      setError('');
    } else {
      router.push(`/workflow/${params.id}/results`);
    }
  };

  const handleRepeat = () => {
    setStepResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepNavigator
          steps={steps}
          currentStep={currentStep}
          onNext={handleNext}
          onRepeat={handleRepeat}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing...</p>
            </div>
          ) : (
            <StepForm
              step={currentStep}
              onSubmit={handleStepSubmit}
              result={stepResult}
              previousStepResults={state.stepResults}
            />
          )}
        </div>
      </div>
    </div>
  );
}
