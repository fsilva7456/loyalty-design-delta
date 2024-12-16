interface MechanicsRecommendation {
  name: string;
  description: string;
  implementation_complexity: string;
}

interface CustomerSegment {
  segment_name: string;
  segment_size: number;
}

interface CostEstimationFormProps {
  onSubmit: (data: any) => void;
  customerSegments?: CustomerSegment[];
  selectedMechanics?: MechanicsRecommendation[];
  company_name?: string;
  industry?: string;
}

export default function CostEstimationForm({ 
  onSubmit, 
  customerSegments = [], 
  selectedMechanics = [],
  company_name = '',
  industry = ''
}: CostEstimationFormProps) {
  const totalMembers = customerSegments.reduce((sum, segment) => sum + segment.segment_size, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company_name || !industry) {
      console.error('Missing required data:', { company_name, industry });
      return;
    }

    if (!customerSegments.length || !selectedMechanics.length) {
      console.error('Missing segments or mechanics');
      return;
    }

    onSubmit({
      company_name,
      industry,
      customer_segments: customerSegments,
      selected_mechanics: selectedMechanics,
      total_members: totalMembers
    });
  };

  if (!customerSegments?.length || !selectedMechanics?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        Please complete the customer analysis and loyalty mechanics steps first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Mechanics Overview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Program Mechanics</h3>
        <div className="bg-gray-50 rounded-md overflow-hidden divide-y divide-gray-200">
          {selectedMechanics.map((mech, index) => (
            <div key={index} className="p-4">
              <h4 className="font-medium text-gray-900">{mech.name}</h4>
              <p className="mt-1 text-sm text-gray-600">{mech.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Implementation Complexity: {mech.implementation_complexity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Base Overview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Base Overview</h3>
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
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Members
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {totalMembers.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700">
            Generate detailed cost estimates for implementing the selected loyalty program mechanics for
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
          disabled={!company_name || !industry || !customerSegments.length || !selectedMechanics.length}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Cost Estimation
        </button>
      </form>
    </div>
  );
}
