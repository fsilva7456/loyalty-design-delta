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
  // Debug log
  console.log('Loyalty Objectives Result:', result);

  if (!result) {
    console.log('No result provided');
    return <div>No results available</div>;
  }

  if (!Array.isArray(result.objectives)) {
    console.log('Objectives is not an array:', result.objectives);
    return <div>Invalid results format</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program Objectives</h3>
        <div className="space-y-4">
          {result.objectives.map((obj: LoyaltyObjective, index: number) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-indigo-600 mb-2">
                  Objective {index + 1}:
                </h4>
                <p className="text-gray-900">{obj.objective}</p>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Rationale:</h5>
                  <p className="text-gray-600 text-sm whitespace-pre-line">
                    {obj.rationale}
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
    </div>
  );
}
