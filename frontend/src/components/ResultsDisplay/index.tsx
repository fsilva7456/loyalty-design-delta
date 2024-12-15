interface BusinessCase {
  executive_summary: string;
  key_insights: string;
  cost_breakdown: string;
  roi_projections: string;
  business_impact: string;
  risks_and_mitigation: string;
}

interface ResultsDisplayProps {
  businessCase: BusinessCase | null;
}

export default function ResultsDisplay({ businessCase }: ResultsDisplayProps) {
  if (!businessCase) {
    return <div>Loading business case...</div>;
  }

  const sections = [
    { title: 'Executive Summary', content: businessCase.executive_summary },
    { title: 'Key Insights', content: businessCase.key_insights },
    { title: 'Cost Breakdown', content: businessCase.cost_breakdown },
    { title: 'ROI Projections', content: businessCase.roi_projections },
    { title: 'Business Impact', content: businessCase.business_impact },
    { title: 'Risks and Mitigation', content: businessCase.risks_and_mitigation }
  ];

  return (
    <div className="space-y-8">
      {sections.map(section => (
        <div key={section.title} className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="prose max-w-none text-gray-700">
              {section.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
