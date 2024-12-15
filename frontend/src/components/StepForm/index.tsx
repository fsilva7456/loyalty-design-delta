"use client";

import { useState } from 'react';

interface StepFormProps {
  step: string;
  onSubmit: (data: any) => void;
  result: any;
}

interface FormData {
  company_name?: string;
  industry?: string;
  include_loyalty_program?: boolean;
}

interface CompetitorAnalysisResult {
  workflow_id: string;
  company_name: string;
  industry: string;
  main_competitors: string[];
  competitor_details: string;
  loyalty_insights: string;
  strategic_recommendations: string;
}

export default function StepForm({ step, onSubmit, result }: StepFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name || !formData.industry) {
      setError('Company name and industry are required');
      return;
    }

    let submitData = { ...formData };
    if (step === 'competitor_analysis') {
      submitData.include_loyalty_program = true;
    }

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderCompetitorAnalysisResult = (result: CompetitorAnalysisResult) => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Main Competitors</h3>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            {result.main_competitors.map((competitor, index) => (
              <li key={index}>{competitor}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Competitor Details</h3>
          <p className="mt-2 text-gray-600 whitespace-pre-line">{result.competitor_details}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Loyalty Program Insights</h3>
          <p className="mt-2 text-gray-600 whitespace-pre-line">{result.loyalty_insights}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Strategic Recommendations</h3>
          <p className="mt-2 text-gray-600 whitespace-pre-line">{result.strategic_recommendations}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'competitor_analysis' && (
              <>
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
              </>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="prose max-w-none">
            {step === 'competitor_analysis' ? 
              renderCompetitorAnalysisResult(result as CompetitorAnalysisResult) :
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            }
          </div>
        )}
      </div>
    </div>
  );
}
