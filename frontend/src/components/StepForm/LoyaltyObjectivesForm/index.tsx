import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface CustomerSegment {
  segment_name: string;
  description?: string;
  characteristics?: string[];
  preferences?: string[];
  size_percentage?: number;
  annual_value?: number;
}

interface LoyaltyObjectivesFormProps {
  onSubmit: (data: any) => Promise<void>;
  customerSegments: CustomerSegment[];
  company_name: string;
  industry: string;
  isLoading?: boolean;
}

export default function LoyaltyObjectivesForm({
  onSubmit,
  customerSegments,
  company_name,
  industry,
  isLoading = false
}: LoyaltyObjectivesFormProps) {
  const [objectives, setObjectives] = useState({
    customer_retention: '',
    customer_acquisition: '',
    customer_engagement: '',
    revenue_growth: '',
    brand_loyalty: ''
  });

  const handleChange = (field: string, value: string) => {
    setObjectives(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(objectives).some(value => !value.trim())) {
      toast.error('Please fill in all objectives');
      return;
    }

    try {
      await onSubmit({
        company_name,
        industry,
        objectives,
        customer_segments: customerSegments
      });
    } catch (error) {
      console.error('Error submitting objectives:', error);
      toast.error('Failed to submit objectives');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program Objectives</h3>
        <p className="text-sm text-gray-600 mb-6">
          Define your objectives for each key area of the loyalty program.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Retention
            </label>
            <textarea
              value={objectives.customer_retention}
              onChange={(e) => handleChange('customer_retention', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Describe your customer retention goals..."
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Acquisition
            </label>
            <textarea
              value={objectives.customer_acquisition}
              onChange={(e) => handleChange('customer_acquisition', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Describe your customer acquisition goals..."
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Engagement
            </label>
            <textarea
              value={objectives.customer_engagement}
              onChange={(e) => handleChange('customer_engagement', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Describe your customer engagement goals..."
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Revenue Growth
            </label>
            <textarea
              value={objectives.revenue_growth}
              onChange={(e) => handleChange('revenue_growth', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Describe your revenue growth goals..."
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand Loyalty
            </label>
            <textarea
              value={objectives.brand_loyalty}
              onChange={(e) => handleChange('brand_loyalty', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              placeholder="Describe your brand loyalty goals..."
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Setting Objectives...' : 'Set Objectives'}
      </button>
    </form>
  );
}
