import { useState } from 'react';

interface CustomerSegment {
  segment_name: string;
  segment_size: number;
  average_spend: number;
  visit_frequency: number;
}

interface CustomerAnalysisFormProps {
  onSubmit: (data: any) => void;
}

export default function CustomerAnalysisForm({ onSubmit }: CustomerAnalysisFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [segments, setSegments] = useState<CustomerSegment[]>([
    {
      segment_name: '',
      segment_size: 0,
      average_spend: 0,
      visit_frequency: 0
    }
  ]);

  const handleSegmentChange = (index: number, field: keyof CustomerSegment, value: string) => {
    const updatedSegments = [...segments];
    if (field === 'segment_name') {
      updatedSegments[index][field] = value;
    } else {
      updatedSegments[index][field] = parseFloat(value) || 0;
    }
    setSegments(updatedSegments);
  };

  const addSegment = () => {
    setSegments([
      ...segments,
      {
        segment_name: '',
        segment_size: 0,
        average_spend: 0,
        visit_frequency: 0
      }
    ]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!companyName || !industry) {
      alert('Company name and industry are required');
      return;
    }

    if (!segments.every(seg => 
      seg.segment_name && 
      seg.segment_size > 0 && 
      seg.average_spend > 0 && 
      seg.visit_frequency > 0
    )) {
      alert('Please fill in all segment fields with valid values');
      return;
    }

    onSubmit({
      company_name: companyName,
      industry,
      customer_segments: segments
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Customer Segments</h3>
          <button
            type="button"
            onClick={addSegment}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Segment
          </button>
        </div>

        {segments.map((segment, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Segment Name
                </label>
                <input
                  type="text"
                  value={segment.segment_name}
                  onChange={(e) => handleSegmentChange(index, 'segment_name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Segment Size
                </label>
                <input
                  type="number"
                  value={segment.segment_size || ''}
                  onChange={(e) => handleSegmentChange(index, 'segment_size', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Average Spend ($)
                </label>
                <input
                  type="number"
                  value={segment.average_spend || ''}
                  onChange={(e) => handleSegmentChange(index, 'average_spend', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit Frequency (per year)
                </label>
                <input
                  type="number"
                  value={segment.visit_frequency || ''}
                  onChange={(e) => handleSegmentChange(index, 'visit_frequency', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  min="0.1"
                  step="0.1"
                  required
                />
              </div>
            </div>
            {segments.length > 1 && (
              <button
                type="button"
                onClick={() => removeSegment(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove Segment
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Analyze Customers
      </button>
    </form>
  );
}