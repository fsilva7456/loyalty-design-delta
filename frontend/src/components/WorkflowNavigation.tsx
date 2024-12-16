import React from 'react';
import { useParams } from 'next/navigation';
import { useWorkflowNavigation } from '@/contexts/WorkflowNavigationContext';
import { getNextStep, getPreviousStep, getWorkflowPath } from '@/constants/workflow';
import { Button } from '@/components/ui/button';

export default function WorkflowNavigation() {
  const { id } = useParams();
  const { currentStep, navigateToStep } = useWorkflowNavigation();

  const nextStep = getNextStep(currentStep);
  const previousStep = getPreviousStep(currentStep);

  return (
    <div className="flex justify-between mt-8">
      {previousStep && (
        <Button
          variant="outline"
          onClick={() => navigateToStep(id as string, previousStep)}
        >
          ← Previous Step
        </Button>
      )}
      {nextStep && (
        <Button
          onClick={() => navigateToStep(id as string, nextStep)}
        >
          Next Step →
        </Button>
      )}
    </div>
  );
}