interface CustomerSegment {
  segment_name: string;
  description: string;
  characteristics: string[];
  preferences: string[];
  size_percentage: number;
  annual_value: number;
}

interface CustomerAnalysisResult {
  workflow_id: string;
  segments: CustomerSegment[];
  insights: string;
}

interface Props {
  result: CustomerAnalysisResult;
}

export default function CustomerAnalysisResult({ result }: Props) {
  // Early return with error UI if result or segments is missing/invalid
  if (!result) {
    console.error('CustomerAnalysisResult: No result provided');
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">No analysis results available</p>
      </div>
    );
  }

  // Log the result for debugging
  console.log('CustomerAnalysisResult - received result:', result);

  // Validate segments array exists and is an array
  if (!result.segments || !Array.isArray(result.segments)) {
    console.error('CustomerAnalysisResult: Invalid segments data:', result);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Invalid analysis results format</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments Analysis</h3>
        {result.segments.length === 0 ? (
          <p className="text-gray-500">No customer segments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size (%)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.segments.map((segment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {segment.segment_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        <p className="mb-2">{segment.description}</p>
                        <div className="space-y-2">
                          {Array.isArray(segment.characteristics) && segment.characteristics.length > 0 && (
                            <div>
                              <strong className="text-gray-700">Characteristics:</strong>
                              <ul className="list-disc list-inside ml-4">
                                {segment.characteristics.map((char, idx) => (
                                  <li key={idx}>{char}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {Array.isArray(segment.preferences) && segment.preferences.length > 0 && (
                            <div>
                              <strong className="text-gray-700">Preferences:</strong>
                              <ul className="list-disc list-inside ml-4">
                                {segment.preferences.map((pref, idx) => (
                                  <li key={idx}>{pref}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof segment.size_percentage === 'number' ? 
                        `${segment.size_percentage.toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof segment.annual_value === 'number' ? 
                        `$${segment.annual_value.toLocaleString()}` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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