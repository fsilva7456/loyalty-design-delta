"use client";

import { useParams } from 'next/navigation';
import PerformanceSimulationPage from '@/components/PerformanceSimulationPage';

export default function PerformanceSimulation() {
  const { id } = useParams();
  return <PerformanceSimulationPage id={id as string} />;
}