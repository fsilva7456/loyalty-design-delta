"use client";

import { useParams } from 'next/navigation';
import BusinessCasePage from '@/components/BusinessCasePage';

export default function BusinessCase() {
  const { id } = useParams();
  return <BusinessCasePage id={id as string} />;
}