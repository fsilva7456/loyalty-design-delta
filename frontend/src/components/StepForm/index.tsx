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
import RegenerationModal, { RegenerationModalProps } from '../RegenerationModal';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface StepFormProps {
  step: string;
  onSubmit: (data: any) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.company_name || !formData.industry) {
        setError('Company name and industry are required');
        return;
      }

      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (feedback: string) => {
    if (!onRegenerate) {
      console.error('Regeneration handler not provided');
      throw new Error('Regeneration not available');
    }

    setIsLoading(true);
    try {
      await onRegenerate(feedback);
      setIsRegenerationModalOpen(false);
    } catch (err) {
      console.error('Error during regeneration:', err);
      toast.error('Failed to regenerate analysis. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderForm = () => {
    // [Previous renderForm implementation remains the same]
  };

  const renderResult = () => {
    // [Previous renderResult implementation remains the same]
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
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Regenerating...' : 'Regenerate Response'}
                </button>
              </div>
            )}
          </>
        )}

        {onRegenerate && (
          <RegenerationModal
            {...{
              isOpen: isRegenerationModalOpen,
              onClose: () => setIsRegenerationModalOpen(false),
              onSubmit: handleRegenerate,
              title: `Regenerate ${step.replace('_', ' ').charAt(0).toUpperCase() + step.slice(1)}`,
              isLoading
            } as RegenerationModalProps}
          />
        )}
      </div>
    </div>
  );
}