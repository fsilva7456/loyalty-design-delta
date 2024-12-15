"use client";

import { useWorkflow } from '@/contexts/WorkflowContext';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function ResultsPage() {
  const { state } = useWorkflow();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Loyalty Program Business Case
        </h1>
        <ResultsDisplay businessCase={state.businessCase} />
      </div>
    </div>
  );
}
