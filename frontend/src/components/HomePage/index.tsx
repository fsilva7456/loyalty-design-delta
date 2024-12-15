"use client";

import { startWorkflow } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useWorkflow } from '@/contexts/WorkflowContext';

export default function HomePage() {
  const router = useRouter();
  const { dispatch } = useWorkflow();

  const handleStartWorkflow = async () => {
    try {
      const result = await startWorkflow();
      dispatch({ type: 'SET_WORKFLOW_ID', payload: result.workflow_id });
      router.push(`/workflow/${result.workflow_id}`);
    } catch (error) {
      console.error('Error starting workflow:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Loyalty Program Designer
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Design and evaluate loyalty programs tailored to your business needs.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={handleStartWorkflow}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Start Designing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
