"use client";

import { useParams } from 'next/navigation';
import CostEstimationPage from '@/components/CostEstimationPage';

export default function CostEstimation() {
  const { id } = useParams();
  return <CostEstimationPage id={id as string} />;
}