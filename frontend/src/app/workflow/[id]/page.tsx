"use client";

import { useParams } from 'next/navigation';
import WorkflowPage from '@/components/WorkflowPage';

export default function Workflow() {
  const { id } = useParams();
  return <WorkflowPage id={id as string} />;
}