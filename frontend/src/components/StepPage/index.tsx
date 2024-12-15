"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
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

  const steps = [
    'competitor_analysis',
    'customer_analysis',
    'loyalty_objectives',
    'loyalty_mechanics',
    'cost_estimation',
    'performance_simulation',
    'business_case'
  ];

  const handleStepSubmit = async (formData: any) => {
    try {
      const result = await executeStep(currentStep, {
        workflow_id: params.id,
        ...formData
      });
      setStepResult(result);
      dispatch({
        type: 'SET_STEP_RESULT',
        payload: { step: currentStep, result }
      });
    } catch (error) {
      console.error(`Error executing step ${currentStep}:`, error);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setStepResult(null);
    } else {
      router.push(`/workflow/${params.id}/results`);
    }
  };

  const handleRepeat = () => {
    setStepResult(null);
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
        <div className="mt-8">
          <StepForm
            step={currentStep}
            onSubmit={handleStepSubmit}
            result={stepResult}
          />
        </div>
      </div>
    </div>
  );
}
