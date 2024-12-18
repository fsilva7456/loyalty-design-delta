"use client";

import { useRouter } from 'next/navigation';
import { useWorkflowContext } from '@/contexts/WorkflowContext';
import { startWorkflow } from '@/services/api';
import { WorkflowResponse } from '@/types/workflow';

export default function HomePage() {
  const router = useRouter();
  const { dispatch, state } = useWorkflowContext();

  const handleStartClick = async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const result = await startWorkflow() as WorkflowResponse;
      if (!result?.workflow_id) {
        throw new Error('No workflow ID received');
      }
      
      dispatch({ type: 'SET_WORKFLOW_ID', payload: result.workflow_id });
      router.push(`/workflow/${result.workflow_id}`);
    } catch (error) {
      console.error('Error starting workflow:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to start workflow. Please try again.' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold mb-8">
        Loyalty Program Design Assistant
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl">
        Create, analyze, and optimize your loyalty program strategy with AI-powered insights
      </p>
      
      {state.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {state.error}
        </div>
      )}

      <button
        onClick={handleStartClick}
        disabled={state.isLoading}
        className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.isLoading ? (
          <div className="flex items-center">
            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Starting...
          </div>
        ) : (
          'Start Designing'
        )}
      </button>
    </main>
  );
}
