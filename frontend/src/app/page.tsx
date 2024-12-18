"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startWorkflow } from '@/services/api';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { toast } from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const { dispatch } = useWorkflow();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClick = async () => {
    setIsLoading(true);
    
    try {
      const result = await startWorkflow();
      dispatch({ type: 'SET_WORKFLOW_ID', payload: result.workflow_id });
      router.push(`/workflow/${result.workflow_id}`);
    } catch (error) {
      console.error('Error starting workflow:', error);
      toast.error('Failed to start workflow. Please try again.');
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to start workflow'
      });
    } finally {
      setIsLoading(false);
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

      <button
        onClick={handleStartClick}
        disabled={isLoading}
        className="px-8 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
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
