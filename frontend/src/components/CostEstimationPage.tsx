import React from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';

interface CostEstimationPageProps {
  id: string;
}

export default function CostEstimationPage({ id }: CostEstimationPageProps) {
  const { workflow } = useWorkflow();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Cost Estimation</h1>
      {/* Rest of your cost estimation page content */}
    </div>
  );
}