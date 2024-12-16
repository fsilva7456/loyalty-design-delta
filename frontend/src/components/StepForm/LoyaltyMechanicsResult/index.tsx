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
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Loyalty Program Mechanics</h3>
        <div className="space-y-6">
          {result.recommended_mechanics.map((mech, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-indigo-600 mb-2">
                  {mech.name}
                </h4>
                <p className="text-gray-700 mb-4">{mech.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Benefits:</h5>
                    <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                      {mech.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700">Implementation:</h5>
                      <p className="text-sm text-gray-600">{mech.implementation_complexity}</p>
                    </div>
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700">Cost Estimate:</h5>
                      <p className="text-sm text-gray-600">{mech.cost_estimate}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Expected Impact:</h5>
                      <p className="text-sm text-gray-600">{mech.expected_impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Implementation Roadmap</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{result.implementation_roadmap}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Success Metrics</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <ul className="list-disc pl-4 text-gray-700 space-y-2">
            {result.success_metrics.map((metric, index) => (
              <li key={index}>{metric}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
