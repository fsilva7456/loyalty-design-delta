import { FC } from 'react';

type WorkflowStep = 'customer_analysis' | 'competitor_analysis' | 'loyalty_objectives' | 'loyalty_mechanics' | 'cost_estimation';

interface StepNavigatorProps {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  onStepChange: (step: WorkflowStep) => void;
  isLoading?: boolean;
}

const STEP_ORDER: WorkflowStep[] = [
  'customer_analysis',
  'competitor_analysis',
  'loyalty_objectives',
  'loyalty_mechanics',
  'cost_estimation'
];

const STEP_LABELS: Record<WorkflowStep, string> = {
  customer_analysis: 'Customer Analysis',
  competitor_analysis: 'Competitor Analysis',
  loyalty_objectives: 'Loyalty Objectives',
  loyalty_mechanics: 'Loyalty Mechanics',
  cost_estimation: 'Cost Estimation'
};

const StepNavigator: FC<StepNavigatorProps> = ({
  currentStep,
  completedSteps,
  onStepChange,
  isLoading = false
}) => {
  const isStepComplete = (step: WorkflowStep) => completedSteps.includes(step);
  const isStepAvailable = (step: WorkflowStep) => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    const stepIndex = STEP_ORDER.indexOf(step);
    return stepIndex <= currentIndex || isStepComplete(step);
  };

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {STEP_ORDER.map((step) => {
          const isCurrent = step === currentStep;
          const isCompleted = isStepComplete(step);
          const isAvailable = isStepAvailable(step);

          return (
            <li key={step} className="md:flex-1">
              <button
                onClick={() => isAvailable && !isLoading && onStepChange(step)}
                disabled={!isAvailable || isLoading}
                className={`group flex flex-col border rounded-md py-2 px-4 hover:border-indigo-600 w-full 
                  ${isCurrent ? 'border-indigo-600' : ''}
                  ${isCompleted ? 'border-green-600' : ''}
                  ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isLoading ? 'cursor-not-allowed' : ''}`}
              >
                <span className="text-xs font-medium">
                  {isCompleted ? '✓ ' : ''}
                  {STEP_LABELS[step]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepNavigator;
