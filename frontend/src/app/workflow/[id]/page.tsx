import StepPage from '@/components/StepPage';

export default function WorkflowStep({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <StepPage />
    </main>
  );
}
