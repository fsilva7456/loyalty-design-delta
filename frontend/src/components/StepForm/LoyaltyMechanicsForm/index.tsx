interface LoyaltyObjective {
  objective: string;
  rationale: string;
}

interface CustomerSegment {
  segment_name: string;
  segment_size: number;
  spend_potential: number;
  churn_risk: number;
  growth_opportunity: string;
}

interface LoyaltyMechanicsFormProps {
  onSubmit: (data: any) => void;
  customerSegments?: CustomerSegment[];
  objectives?: LoyaltyObjective[];
  company_name?: string;
  industry?: string;
}

export default function LoyaltyMechanicsForm({ 
  onSubmit, 
  customerSegments = [], 
  objectives = [],
  company_name = '',
  industry = ''
}: LoyaltyMechanicsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company_name || !industry) {
      console.error('Missing required data:', { company_name, industry });
      return;
    }

    if (!customerSegments.length || !objectives.length) {
      console.error('Missing segments or objectives');
      return;
    }

    onSubmit({
      company_name,
      industry,
      customer_segments: customerSegments,
      objectives: objectives
    });
  };

  if (!customerSegments?.length || !objectives?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        Please complete the customer analysis and objectives steps first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Loyalty Program Objectives</h3>
        <div className="bg-gray-50 rounded-md overflow-hidden divide-y divide-gray-200">
          {objectives.map((obj, index) => (
            <div key={index} className="p-4">
              <h4 className="font-medium text-gray-900">Objective {index + 1}</h4>
              <p className="mt-1 text-gray-600">{obj.objective}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments Overview</h3>
        <div className="bg-gray-50 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Segment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend Potential
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Churn Risk
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerSegments.map((segment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {segment.segment_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {segment.segment_size.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {segment.spend_potential.toFixed(1)} / 10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(segment.churn_risk * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700">
            Based on your customer segments and objectives, we'll recommend loyalty program mechanics for
            <span className="font-medium"> {company_name}</span> in the
            <span className="font-medium"> {industry}</span> industry.
          </p>
        </div>

        {(!company_name || !industry) && (
          <div className="text-red-600 text-sm">
            Warning: Missing company name or industry data. Please complete previous steps first.
          </div>
        )}

        <button
          type="submit"
          disabled={!company_name || !industry || !customerSegments.length || !objectives.length}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Mechanics Recommendations
        </button>
      </form>
    </div>
  );
}
