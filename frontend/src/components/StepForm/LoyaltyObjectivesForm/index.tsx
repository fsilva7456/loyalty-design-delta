interface CustomerSegment {
  segment_name: string;
  segment_size: number;
  spend_potential: number;
  churn_risk: number;
  growth_opportunity: string;
}

interface LoyaltyObjectivesFormProps {
  onSubmit: (data: any) => void;
  customerSegments?: CustomerSegment[];
  company_name?: string;
  industry?: string;
}

export default function LoyaltyObjectivesForm({ 
  onSubmit, 
  customerSegments = [], 
  company_name = '',
  industry = ''
}: LoyaltyObjectivesFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company_name || !industry) {
      console.error('Missing required data:', { company_name, industry });
      return;
    }

    console.log('Submitting loyalty objectives with data:', {
      company_name,
      industry,
      customerSegments
    });

    onSubmit({
      company_name,
      industry,
      customer_segments: customerSegments
    });
  };

  if (!customerSegments?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No customer segments available. Please complete the customer analysis step first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments Analysis</h3>
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
            Based on the customer segment analysis above, we'll generate tailored loyalty program objectives for
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
          disabled={!company_name || !industry}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Objectives
        </button>
      </form>
    </div>
  );
}
