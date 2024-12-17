interface CustomerSegment {
  segment_name: string;
  description: string;
  characteristics: string[];
  preferences: string[];
  size_percentage: number;
  annual_value: number;
}

interface CustomerAnalysisResult {
  segments: CustomerSegment[];
  insights: string;
}

interface Props {
  result: CustomerAnalysisResult;
}

export default function CustomerAnalysisResult({ result }: Props) {
  if (!result || !result.segments) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-600">No analysis results available</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments Analysis</h3>
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
                        <div>
                          <strong className="text-gray-700">Characteristics:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {segment.characteristics.map((char, idx) => (
                              <li key={idx}>{char}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong className="text-gray-700">Preferences:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {segment.preferences.map((pref, idx) => (
                              <li key={idx}>{pref}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {segment.size_percentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${segment.annual_value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
