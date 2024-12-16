interface LoyaltyObjective {
  objective: string;
  rationale: string;
}

interface LoyaltyObjectivesResult {
  objectives: LoyaltyObjective[];
  insights: string;
}

interface Props {
  result: LoyaltyObjectivesResult;
}

export default function LoyaltyObjectivesResult({ result }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program Objectives</h3>
        <div className="space-y-4">
          {result.objectives.map((objective, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {index + 1}. {objective.objective}
                </h4>
                <p className="text-gray-600 text-sm">
                  {objective.rationale}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{result.insights}</p>
        </div>
      </div>
    </div>
  );
}
