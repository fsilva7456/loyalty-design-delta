import React from 'react';
import Link from 'next/link';

interface StepNavigationProps {
  id: string;
  currentStep: string;
  nextStep?: string;
  previousStep?: string;
}

export default function StepNavigation({ 
  id, 
  currentStep,
  nextStep,
  previousStep 
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      {previousStep && (
        <Link 
          href={`/workflow/${id}/${previousStep}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Previous Step
        </Link>
      )}
      {nextStep && (
        <Link 
          href={`/workflow/${id}/${nextStep}`}
          className="text-blue-600 hover:text-blue-800 ml-auto"
        >
          Next Step →
        </Link>
      )}
    </div>
  );
}