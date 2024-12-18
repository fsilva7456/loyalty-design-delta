import { FC } from 'react';
import {
  WorkflowStep,
  WORKFLOW_STEPS,
  STEP_LABELS,
  isStepAvailable
} from '@/types/workflow';

interface StepNavigatorProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  isLoading?: boolean;
}

const StepNavigator: FC<StepNavigatorProps> = ({
  currentStep,
  completedSteps,
  isLoading = false
}) => {
  const getStepStatus = (step: WorkflowStep) => {
    if (step === currentStep) return 'current';
    if (completedSteps.includes(step)) return 'completed';
    if (isStepAvailable(step, currentStep, completedSteps)) return 'upcoming';
    return 'disabled';
  };

  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {WORKFLOW_STEPS.map((step) => {
          const status = getStepStatus(step);
          const isCurrent = step === currentStep;
          const isCompleted = completedSteps.includes(step);
          const isAvailable = isStepAvailable(step, currentStep, completedSteps);

          return (
            <li key={step} className="md:flex-1">
              <div
                className={`
                  group flex flex-col border rounded-md py-2 px-4 w-full
                  ${isCurrent ? 'border-indigo-600 bg-indigo-50' : ''}
                  ${isCompleted ? 'border-green-600 bg-green-50' : ''}
                  ${!isAvailable ? 'opacity-50' : ''}
                  ${isLoading ? 'cursor-not-allowed' : ''}
                  ${!isCurrent && !isCompleted ? 'border-gray-300' : ''}
                `}
                role="button"
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={!isAvailable || isLoading}
              >
                <span className={`
                  text-xs font-medium
                  ${isCurrent ? 'text-indigo-600' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${!isAvailable ? 'text-gray-500' : 'text-gray-900'}
                `}>
                  {isCompleted && (
                    <span className="mr-1.5" aria-hidden="true">✓</span>
                  )}
                  {STEP_LABELS[step]}
                </span>
                {isCurrent && (
                  <span className="text-xs text-gray-500 mt-1">
                    {isLoading ? 'Processing...' : 'Current step'}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepNavigator;