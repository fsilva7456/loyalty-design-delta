interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  loyalty_programs: string[];
}

interface CompetitorAnalysisResultProps {
  result: {
    competitors: Competitor[];
    market_insights: string;
  };
}

export default function CompetitorAnalysisResult({ result }: CompetitorAnalysisResultProps) {
  if (!result?.competitors) {
    return (
      <div className="text-red-600">
        No competitor analysis data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Competitor Analysis Results</h3>
      
      <div className="space-y-8">
        {result.competitors.map((competitor, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">{competitor.name}</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-green-700 mb-2">Strengths</h5>
                <ul className="list-disc list-inside space-y-1">
                  {competitor.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-red-700 mb-2">Weaknesses</h5>
                <ul className="list-disc list-inside space-y-1">
                  {competitor.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm">{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-blue-700 mb-2">Loyalty Programs</h5>
              <ul className="list-disc list-inside space-y-1">
                {competitor.loyalty_programs.map((program, idx) => (
                  <li key={idx} className="text-sm">{program}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {result.market_insights && (
        <div className="mt-6">
          <h4 className="font-medium text-lg mb-2">Market Insights</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{result.market_insights}</p>
        </div>
      )}
    </div>
  );
}