interface CompetitorAnalysisResult {
  workflow_id: string;
  company_name: string;
  industry: string;
  main_competitors: string[];
  competitor_details: string;
  loyalty_insights: string;
  strategic_recommendations: string;
}

interface Props {
  result: CompetitorAnalysisResult;
}

export default function CompetitorAnalysisResult({ result }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Main Competitors</h3>
        <ul className="list-disc pl-5 space-y-2">
          {result.main_competitors.map((competitor, index) => (
            <li key={index} className="text-gray-700">{competitor}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Competitor Analysis</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{result.competitor_details}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program Insights</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{result.loyalty_insights}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Strategic Recommendations</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{result.strategic_recommendations}</p>
        </div>
      </div>
    </div>
  );
}
