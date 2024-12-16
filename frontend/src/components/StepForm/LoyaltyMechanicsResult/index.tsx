interface MechanicsRecommendation {
  name: string;
  description: string;
  benefits: string[];
  implementation_complexity: string;
  cost_estimate: string;
  expected_impact: string;
}

interface LoyaltyMechanicsResult {
  workflow_id: string;
  recommended_mechanics: MechanicsRecommendation[];
  implementation_roadmap: string;
  success_metrics: string[];
}

interface Props {
  result: LoyaltyMechanicsResult;
}

export default function LoyaltyMechanicsResult({ result }: Props) {
  if (!result) {
    return <div>No results available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Recommended Mechanics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Program Mechanics</h3>
        <div className="space-y-4">
          {result.recommended_mechanics.map((mech, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-indigo-600 mb-2">
                  {mech.name}
                </h4>
                <p className="text-gray-600 mb-4">{mech.description}</p>
                
                {/* Benefits */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Benefits:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {mech.benefits.map((benefit, i) => (
                      <li key={i} className="text-gray-600 text-sm">{benefit}</li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Details */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Implementation Complexity</h5>
                    <p className="text-gray-600">{mech.implementation_complexity}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Cost Estimate</h5>
                    <p className="text-gray-600">{mech.cost_estimate}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Expected Impact</h5>
                    <p className="text-gray-600">{mech.expected_impact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Implementation Roadmap</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{result.implementation_roadmap}</p>
        </div>
      </div>

      {/* Success Metrics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Success Metrics</h3>
        <div className="bg-gray-50 rounded-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {result.success_metrics.map((metric, index) => (
              <li key={index} className="px-4 py-3 text-gray-700">{metric}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
