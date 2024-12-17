"use client";

import { useState, useEffect } from 'react';
import CustomerAnalysisForm from './CustomerAnalysisForm';
import CustomerAnalysisResult from './CustomerAnalysisResult';
import CompetitorAnalysisResult from './CompetitorAnalysisResult';
import LoyaltyObjectivesForm from './LoyaltyObjectivesForm';
import LoyaltyObjectivesResult from './LoyaltyObjectivesResult';
import LoyaltyMechanicsForm from './LoyaltyMechanicsForm';
import LoyaltyMechanicsResult from './LoyaltyMechanicsResult';
import CostEstimationForm from './CostEstimationForm';
import CostEstimationResult from './CostEstimationResult';
import RegenerationModal from '../RegenerationModal';
import { useParams } from 'next/navigation';

interface StepFormProps {
  step: string;
  onSubmit: (data: any) => void;
  onRegenerate?: (feedback: string) => Promise<void>;
  result: any;
  previousStepResults?: Record<string, any>;
}

interface FormData {
  company_name?: string;
  industry?: string;
}

export default function StepForm({ 
  step, 
  onSubmit, 
  onRegenerate,
  result, 
  previousStepResults = {} 
}: StepFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [error, setError] = useState<string>('');
  const [isRegenerationModalOpen, setIsRegenerationModalOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (result) {
      console.log(`Debug - ${step} result:`, result);
    }
  }, [result, step]);

  // Helper function to get company name and industry
  const getCompanyAndIndustry = () => {
    const customerAnalysisResult = previousStepResults?.customer_analysis;
    const competitorAnalysisResult = previousStepResults?.competitor_analysis;
    const objectivesResult = previousStepResults?.loyalty_objectives;
    
    return {
      companyName: customerAnalysisResult?.company_name || 
                  competitorAnalysisResult?.company_name || 
                  objectivesResult?.company_name || '',
      industry: customerAnalysisResult?.industry || 
               competitorAnalysisResult?.industry || 
               objectivesResult?.industry || ''
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name || !formData.industry) {
      setError('Company name and industry are required');
      return;
    }

    onSubmit(formData);
  };

  const handleRegenerate = async (feedback: string) => {
    if (!onRegenerate) {
      console.error('Regeneration handler not provided');
      throw new Error('Regeneration not available');
    }

    try {
      await onRegenerate(feedback);
    } catch (err) {
      console.error('Error during regeneration:', err);
      throw err;
    }
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
        const { companyName, industry } = getCompanyAndIndustry();
        const customerAnalysisResult = previousStepResults?.customer_analysis;
        
        return (
          <LoyaltyObjectivesForm 
            onSubmit={onSubmit}
            customerSegments={customerAnalysisResult?.segments || []}
            company_name={companyName}
            industry={industry}
          />
        );
      
      case 'loyalty_mechanics':
        const { companyName: mechCompanyName, industry: mechIndustry } = getCompanyAndIndustry();
        const customerResult = previousStepResults?.customer_analysis;
        const objectivesResult = previousStepResults?.loyalty_objectives;

        return (
          <LoyaltyMechanicsForm
            onSubmit={onSubmit}
            customerSegments={customerResult?.segments || []}
            objectives={objectivesResult?.objectives}
            company_name={mechCompanyName}
            industry={mechIndustry}
          />
        );

      case 'cost_estimation':
        const { companyName: costCompanyName, industry: costIndustry } = getCompanyAndIndustry();
        const custResult = previousStepResults?.customer_analysis;
        const mechResult = previousStepResults?.loyalty_mechanics;

        return (
          <CostEstimationForm
            onSubmit={onSubmit}
            customerSegments={custResult?.segments || []}
            selectedMechanics={mechResult?.recommended_mechanics}
            company_name={costCompanyName}
            industry={costIndustry}
          />
        );

      default:
        return <div>Form not implemented for this step</div>;
    }
  };

  const renderResult = () => {
    if (!result) {
      return <div>No results available</div>;
    }

    try {
      switch (step) {
        case 'competitor_analysis':
          return <CompetitorAnalysisResult result={result} />;
        
        case 'customer_analysis':
          if (!result.segments || !Array.isArray(result.segments)) {
            console.error('Invalid customer analysis result structure:', result);
            throw new Error('Invalid customer analysis result structure');
          }
          return <CustomerAnalysisResult result={result} />;
        
        case 'loyalty_objectives':
          return <LoyaltyObjectivesResult result={result} />;
        
        case 'loyalty_mechanics':
          return <LoyaltyMechanicsResult result={result} />;

        case 'cost_estimation':
          return <CostEstimationResult result={result} />;
        
        default:
          return (
            <div className="prose max-w-none">
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering result:', error);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Error displaying results. Please try again or contact support if the issue persists.</p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs text-red-800">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          )}
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
        
        {!result ? renderForm() : (
          <>
            {renderResult()}
            {onRegenerate && (
              <div className="mt-4">
                <button
                  onClick={() => setIsRegenerationModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Regenerate Response
                </button>
              </div>
            )}
          </>
        )}

        {onRegenerate && (
          <RegenerationModal
            isOpen={isRegenerationModalOpen}
            onClose={() => setIsRegenerationModalOpen(false)}
            onSubmit={handleRegenerate}
            title={`Regenerate ${step.replace('_', ' ').charAt(0).toUpperCase() + step.slice(1)}`}
          />
        )}
      </div>
    </div>
  );
}