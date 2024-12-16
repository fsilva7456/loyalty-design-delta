import React from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';

interface BusinessCasePageProps {
  id: string;
}

export default function BusinessCasePage({ id }: BusinessCasePageProps) {
  const { workflow } = useWorkflow();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Business Case</h1>
      {/* Rest of your business case page content */}
    </div>
  );
}