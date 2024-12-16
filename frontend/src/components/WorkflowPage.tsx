import React from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';

interface WorkflowPageProps {
  id: string;
}

export default function WorkflowPage({ id }: WorkflowPageProps) {
  const { workflow } = useWorkflow();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Workflow {id}</h1>
      {/* Rest of your workflow page content */}
    </div>
  );
}