interface LoyaltyObjective {
  objective: string;
  rationale: string;
}

interface LoyaltyObjectivesResult {
  workflow_id: string;
  objectives: LoyaltyObjective[];
  insights: string;
}

interface Props {
  result: LoyaltyObjectivesResult;
}

export default function LoyaltyObjectivesResult({ result }: Props) {
  if (!result || !result.objectives) {
    return <div>No results available</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program Objectives</h3>
        <div className="space-y-4">
          {Array.isArray(result.objectives) && result.objectives.map((objective, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-indigo-600 mb-2">
                  Objective {index + 1}: {objective.objective}
                </h4>
                <div className="mt-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Rationale:</h5>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {objective.rationale}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.insights && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 whitespace-pre-line">{result.insights}</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>These objectives are based on the customer segmentation analysis and are designed to maximize customer loyalty and business value.</p>
      </div>
    </div>
  );
}
