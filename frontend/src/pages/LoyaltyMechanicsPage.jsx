import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useApi } from '@/hooks/useApi';
import LoyaltyMechanicsForm from '@/components/LoyaltyMechanicsForm';
import LoyaltyMechanicsResult from '@/components/LoyaltyMechanicsResult';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const LoyaltyMechanicsPage = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const { workflow, updateWorkflowStep } = useWorkflow();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { post } = useApi();
  
  // Get data from previous steps
  const customerSegments = workflow?.steps?.customer_analysis?.segments || [];
  const objectives = workflow?.steps?.loyalty_objectives?.objectives || [];
  
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await post('/api/step/loyalty_mechanics', formData);
      
      // Update workflow with the results
      await updateWorkflowStep('loyalty_mechanics', {
        mechanics: response.mechanics,
        insights: response.insights,
        preferences: formData.mechanics_preferences
      });
      
    } catch (err) {
      setError(err.message || 'Failed to generate loyalty mechanics recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    navigate(`/workflow/${workflowId}/cost-estimation`);
  };

  // Validate required data from previous steps
  if (!customerSegments.length || !objectives.length) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Please complete the Customer Analysis and Loyalty Objectives steps before proceeding.
        </AlertDescription>
      </Alert>
    );
  }

  const results = workflow?.steps?.loyalty_mechanics;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Design Loyalty Program Mechanics</h1>
      
      {!results ? (
        <LoyaltyMechanicsForm
          customerSegments={customerSegments}
          objectives={objectives}
          workflowId={workflowId}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-6">
          <LoyaltyMechanicsResult results={results} />
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={() => updateWorkflowStep('loyalty_mechanics', null)}
            >
              Regenerate Recommendations
            </Button>
            
            <Button onClick={handleNext}>
              Continue to Cost Estimation
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LoyaltyMechanicsPage;