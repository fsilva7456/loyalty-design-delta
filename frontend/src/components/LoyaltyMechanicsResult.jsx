import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoyaltyMechanicsResult = ({ results }) => {
  if (!results || !results.mechanics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Recommended Loyalty Mechanics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.mechanics.map((mechanic, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">
                    {mechanic.mechanic}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">
                        Description
                      </h4>
                      <p className="text-gray-800">{mechanic.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-1">
                        Alignment with Objectives
                      </h4>
                      <p className="text-gray-800">{mechanic.alignment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {results.insights && (
              <Alert className="mt-6">
                <AlertDescription>
                  <h4 className="font-medium mb-2">Key Insights</h4>
                  <p>{results.insights}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyMechanicsResult;