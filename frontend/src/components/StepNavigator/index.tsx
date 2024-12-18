import { FC } from 'react';
import { WorkflowStep, WORKFLOW_STEPS } from '@/types/workflow';

interface StepNavigatorProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  isLoading?: boolean;
}

const STEP_LABELS: Record<WorkflowStep, string> = {
  competitor_analysis: 'Competitor Analysis',
  customer_analysis: 'Customer Analysis',
  loyalty_objectives: 'Loyalty Objectives',
  loyalty_mechanics: 'Loyalty Mechanics',
  cost_estimation: 'Cost Estimation',
  performance_simulation: 'Performance Simulation',
  business_case: 'Business Case'
};

const StepNavigator: FC<StepNavigatorProps> = ({
  currentStep,
  completedSteps,
  isLoading = false
}) => {
  const isStepComplete = (step: WorkflowStep) => completedSteps.includes(step);
  
  const isStepAvailable = (step: WorkflowStep) => {
    const currentIndex = WORKFLOW_STEPS.indexOf(currentStep);
    const stepIndex = WORKFLOW_STEPS.indexOf(step);
    return stepIndex <= currentIndex || isStepComplete(step);
  };

  const getStepStatus = (step: WorkflowStep) => {
    if (step === currentStep) return 'current';
    if (isStepComplete(step)) return 'completed';
    if (isStepAvailable(step)) return 'upcoming';
    return 'disabled';
  };

  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {WORKFLOW_STEPS.map((step) => {
          const status = getStepStatus(step);
          const isCurrent = step === currentStep;
          const isCompleted = isStepComplete(step);
          const isAvailable = isStepAvailable(step);

          return (
            <li key={step} className="md:flex-1">
              <div
                className={`
                  group flex flex-col border rounded-md py-2 px-4 w-full
                  ${isCurrent ? 'border-indigo-600 bg-indigo-50' : ''}
                  ${isCompleted ? 'border-green-600 bg-green-50' : ''}
                  ${!isAvailable ? 'opacity-50' : ''}
                  ${isLoading ? 'cursor-not-allowed' : ''}
                `}
              >
                <span className={`
                  text-xs font-medium
                  ${isCurrent ? 'text-indigo-600' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${!isAvailable ? 'text-gray-500' : 'text-gray-900'}
                `}>
                  {isCompleted && '✓ '}
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