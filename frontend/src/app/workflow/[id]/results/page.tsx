import ResultsPage from '@/components/ResultsPage';

export default function Results({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <ResultsPage />
    </main>
  );
}
