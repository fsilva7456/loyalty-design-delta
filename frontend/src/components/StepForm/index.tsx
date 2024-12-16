"use client";

import { useState } from 'react';
import CustomerAnalysisForm from './CustomerAnalysisForm';
import CustomerAnalysisResult from './CustomerAnalysisResult';
import CompetitorAnalysisResult from './CompetitorAnalysisResult';
import LoyaltyObjectivesForm from './LoyaltyObjectivesForm';
import LoyaltyObjectivesResult from './LoyaltyObjectivesResult';
import LoyaltyMechanicsForm from './LoyaltyMechanicsForm';
import LoyaltyMechanicsResult from './LoyaltyMechanicsResult';
import { useParams } from 'next/navigation';

interface StepFormProps {
  step: string;
  onSubmit: (data: any) => void;
  result: any;
  previousStepResults?: Record<string, any>;
}

interface FormData {
  company_name?: string;
  industry?: string;
}

export default function StepForm({ step, onSubmit, result, previousStepResults = {} }: StepFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [error, setError] = useState<string>('');
  const params = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name || !formData.industry) {
      setError('Company name and industry are required');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderForm = () => {
    switch (step) {
      case 'competitor_analysis':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                required
                value={formData.industry || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Analyze Competitors
            </button>
          </form>
        );
      
      case 'customer_analysis':
        return <CustomerAnalysisForm onSubmit={onSubmit} />;
      
      case 'loyalty_objectives':
        const customerAnalysisResult = previousStepResults?.customer_analysis;
        const competitorAnalysisResult = previousStepResults?.competitor_analysis;
        
        // Get company name and industry from either step's results
        const companyName = customerAnalysisResult?.company_name || competitorAnalysisResult?.company_name || '';
        const industry = customerAnalysisResult?.industry || competitorAnalysisResult?.industry || '';
        
        return (
          <LoyaltyObjectivesForm 
            onSubmit={(data) => onSubmit({
              ...data,
              workflow_id: params.id,
              company_name: companyName,
              industry: industry
            })}
            customerSegments={customerAnalysisResult?.customer_segments}
            company_name={companyName}
            industry={industry}
          />
        );
      
      case 'loyalty_mechanics':
        const customerResult = previousStepResults?.customer_analysis;
        const objectivesResult = previousStepResults?.loyalty_objectives;

        return (
          <LoyaltyMechanicsForm
            onSubmit={(data) => onSubmit({
              ...data,
              workflow_id: params.id,
              company_name: customerResult?.company_name || '',
              industry: customerResult?.industry || ''
            })}
            customerSegments={customerResult?.customer_segments}
            objectives={objectivesResult?.objectives}
            company_name={customerResult?.company_name || ''}
            industry={customerResult?.industry || ''}
          />
        );

      default:
        return <div>Form not implemented for this step</div>;
    }
  };

  const renderResult = () => {
    switch (step) {
      case 'competitor_analysis':
        return <CompetitorAnalysisResult result={result} />;
      
      case 'customer_analysis':
        return <CustomerAnalysisResult result={result} />;
      
      case 'loyalty_objectives':
        return <LoyaltyObjectivesResult result={result} />;
      
      case 'loyalty_mechanics':
        return <LoyaltyMechanicsResult result={result} />;
      
      default:
        return (
          <div className="prose max-w-none">
            <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {!result ? renderForm() : renderResult()}
      </div>
    </div>
  );
}
