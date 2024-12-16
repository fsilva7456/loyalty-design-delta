interface StepNavigatorProps {
  steps: string[];
  currentStep: string;
  onNext: () => void;
  onRepeat: (feedback: string) => void;
}

export default function StepNavigator({
  steps,
  currentStep,
  onNext,
  onRepeat
}: StepNavigatorProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const currentIndex = steps.indexOf(currentStep);

  const handleRepeat = (feedback: string) => {
    onRepeat(feedback);
    setShowFeedbackModal(false);
  };

  return (
    <div className="space-y-4">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-5">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center">
              <div
                className={`${index <= currentIndex ? 'bg-indigo-600' : 'bg-gray-200'}
                  h-2.5 w-2.5 rounded-full`}
              />
              <span className="ml-2 text-sm font-medium text-gray-500">
                {step.replace('_', ' ').charAt(0).toUpperCase() + step.slice(1).replace('_', ' ')}
              </span>
            </li>
          ))}
        </ol>
      </nav>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Repeat Step
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Next Step
        </button>
      </div>

      <RegenerationModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleRepeat}
        title={`Regenerate ${currentStep.replace('_', ' ').charAt(0).toUpperCase() + currentStep.slice(1)}`}
      />
    </div>
  );
}
