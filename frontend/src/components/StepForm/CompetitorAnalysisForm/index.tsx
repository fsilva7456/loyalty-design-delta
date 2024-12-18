"use client";

import { useState } from 'react';
import { useWorkflow } from '@/contexts/WorkflowContext';

interface CompetitorAnalysisFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function CompetitorAnalysisForm({ 
  onSubmit,
  isLoading = false 
}: CompetitorAnalysisFormProps) {
  const { state, dispatch } = useWorkflow();
  const [formData, setFormData] = useState({
    company_name: state.companyName || '',
    industry: state.industry || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update company info in context
    dispatch({
      type: 'SET_COMPANY_INFO',
      payload: {
        companyName: formData.company_name,
        industry: formData.industry
      }
    });

    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          required
          value={formData.company_name}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry
        </label>
        <input
          type="text"
          id="industry"
          name="industry"
          required
          value={formData.industry}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing Competitors...' : 'Analyze Competitors'}
      </button>
    </form>
  );
}