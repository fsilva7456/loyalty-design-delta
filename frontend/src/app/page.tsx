"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartClick = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-9eb2.up.railway.app';
      const response = await axios.post(`${API_URL}/start_workflow`);
      
      if (response.data?.workflow_id) {
        router.push(`/workflow/${response.data.workflow_id}`);
      } else {
        throw new Error('No workflow ID received');
      }
    } catch (err) {
      console.error('Error starting workflow:', err);
      setError('Failed to start workflow. Please try again.');
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
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

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
