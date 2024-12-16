"use client";

import { useState } from 'react';
import StepForm from '@/components/StepForm';
import StepNavigator from '@/components/StepNavigator';
import { RegenerationProvider } from '@/components/StepForm/RegenerationContext';

const WORKFLOW_STEPS = [
  'competitor_analysis',
  'customer_analysis',
  'loyalty_objectives',
  'loyalty_mechanics',
  'cost_estimation'
];

export default function WorkflowPage({ params }: { params: { id: string } }) {
  return (
    <RegenerationProvider>
      <WorkflowContent params={params} />
    </RegenerationProvider>
  );
}

function WorkflowContent({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState('competitor_analysis');
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStepSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/step/${currentStep}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          workflow_id: params.id
        }),
      });

      if (!response.ok) {
        throw new Error('Step submission failed');
      }

      const result = await response.json();
      setStepResults(prev => ({
        ...prev,
        [currentStep]: result
      }));
    } catch (error) {
      console.error('Error during step submission:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepRegenerate = async (feedback: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/step/${currentStep}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_id: params.id,
          previous_result: stepResults[currentStep],
          user_feedback: feedback,
          original_request: stepResults[currentStep]?.original_request
        }),
      });

      if (!response.ok) {
        throw new Error('Regeneration failed');
      }

      const result = await response.json();
      setStepResults(prev => ({
        ...prev,
        [currentStep]: result
      }));
    } catch (error) {
      console.error('Error during regeneration:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <StepNavigator
        steps={WORKFLOW_STEPS}
        currentStep={currentStep}
        onNext={() => {
          const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
          if (currentIndex < WORKFLOW_STEPS.length - 1) {
            setCurrentStep(WORKFLOW_STEPS[currentIndex + 1]);
          }
        }}
        onRepeat={handleStepRegenerate}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <StepForm
          step={currentStep}
          onSubmit={handleStepSubmit}
          result={stepResults[currentStep]}
          previousStepResults={stepResults}
        />
      )}
    </div>
  );
}
