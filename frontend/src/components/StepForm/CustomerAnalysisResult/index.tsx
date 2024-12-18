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
  console.log('CustomerAnalysisResult - Received result:', result);
  
  if (!result) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">No analysis results available</p>
      </div>
    );
  }

  if (!result.segments || !Array.isArray(result.segments)) {
    console.error('Invalid segments data:', result);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Invalid analysis results format</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Segments Analysis</h3>
        <div className="grid gap-6">
          {result.segments.map((segment, index) => (
            <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {segment.segment_name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {`Annual Value: $${segment.annual_value.toLocaleString()} · Size: ${segment.size_percentage}%`}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700">{segment.description}</p>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Characteristics</h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        {segment.characteristics.map((char, idx) => (
                          <li key={idx}>{char}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Preferences</h4>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        {segment.preferences.map((pref, idx) => (
                          <li key={idx}>{pref}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.insights && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 whitespace-pre-line">{result.insights}</p>
          </div>
        </div>
      )}
    </div>
  );
}
