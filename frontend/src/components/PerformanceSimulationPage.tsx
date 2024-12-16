import React from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';

interface PerformanceSimulationPageProps {
  id: string;
}

export default function PerformanceSimulationPage({ id }: PerformanceSimulationPageProps) {
  const { workflow } = useWorkflow();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Performance Simulation</h1>
      {/* Rest of your performance simulation page content */}
    </div>
  );
}