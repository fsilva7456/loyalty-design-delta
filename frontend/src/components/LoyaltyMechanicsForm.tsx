import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { CustomerSegment, LoyaltyMechanicsFormData } from '@/types/loyalty';

interface LoyaltyMechanicsFormProps {
  customerSegments: CustomerSegment[];
  objectives: string[];
  workflowId: string;
  onSubmit: (data: LoyaltyMechanicsFormData) => void;
  isLoading: boolean;
}

const MECHANIC_OPTIONS = [
  { label: 'Points System', value: 'points' },
  { label: 'Cashback Rewards', value: 'cashback' },
  { label: 'Tiered Benefits', value: 'tiered' },
  { label: 'Member Exclusive Perks', value: 'exclusive' },
  { label: 'Subscription Model', value: 'subscription' }
] as const;

const LoyaltyMechanicsForm: React.FC<LoyaltyMechanicsFormProps> = ({ 
  customerSegments, 
  objectives, 
  workflowId, 
  onSubmit, 
  isLoading 
}) => {
  const [selectedMechanics, setSelectedMechanics] = useState<string[]>([]);
  const [customPreferences, setCustomPreferences] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMechanics.length === 0) {
      setError('Please select at least one loyalty mechanic');
      return;
    }
    
    const requestData: LoyaltyMechanicsFormData = {
      workflow_id: workflowId,
      customer_segments: customerSegments,
      objectives: objectives,
      mechanics_preferences: {
        selected_mechanics: selectedMechanics,
        custom_preferences: customPreferences || undefined
      }
    };
    
    onSubmit(requestData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Design Loyalty Mechanics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Preferred Loyalty Mechanics
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MECHANIC_OPTIONS.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedMechanics.includes(option.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedMechanics(prev =>
                        prev.includes(value)
                          ? prev.filter(m => m !== value)
                          : [...prev, value]
                      );
                      setError('');
                    }}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Preferences or Requirements
            </label>
            <textarea
              value={customPreferences}
              onChange={(e) => setCustomPreferences(e.target.value)}
              className="w-full p-2 border rounded min-h-24"
              placeholder="Enter any specific requirements or preferences for your loyalty program mechanics..."
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              'Generate Recommendations'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoyaltyMechanicsForm;