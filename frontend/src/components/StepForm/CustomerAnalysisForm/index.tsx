"use client";

import { useState } from 'react';
import { useWorkflow } from '@/contexts/WorkflowContext';

interface CustomerAnalysisFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

interface FormData {
  target_segments: string;
  segment_characteristics: string;
  company_name: string;
  industry: string;
}

export default function CustomerAnalysisForm({ 
  onSubmit,
  isLoading = false 
}: CustomerAnalysisFormProps) {
  const { state } = useWorkflow();
  const [formData, setFormData] = useState<FormData>({
    target_segments: '',
    segment_characteristics: '',
    company_name: state.companyName || '',
    industry: state.industry || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="target_segments" className="block text-sm font-medium text-gray-700">
          Target Customer Segments
        </label>
        <textarea
          id="target_segments"
          name="target_segments"
          required
          value={formData.target_segments}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Describe your target customer segments"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="segment_characteristics" className="block text-sm font-medium text-gray-700">
          Segment Characteristics
        </label>
        <textarea
          id="segment_characteristics"
          name="segment_characteristics"
          required
          value={formData.segment_characteristics}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Describe key characteristics of each segment"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing Customers...' : 'Analyze Customers'}
      </button>
    </form>
  );
}