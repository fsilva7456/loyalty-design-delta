interface SetupCost {
  category: string;
  description: string;
  amount: number;
  timeline_months: number;
}

interface OperationalCost {
  category: string;
  description: string;
  monthly_amount: number;
  scaling_factor: string;
}

interface MemberCost {
  category: string;
  description: string;
  cost_per_member: number;
  affected_segments: string[];
}

interface ROIProjection {
  timeline_months: number;
  projected_revenue: number;
  total_cost: number;
  net_benefit: number;
  roi_percentage: number;
}

interface CostEstimationResult {
  workflow_id: string;
  setup_costs: SetupCost[];
  operational_costs: OperationalCost[];
  member_costs: MemberCost[];
  total_setup_cost: number;
  total_monthly_operational_cost: number;
  total_monthly_member_cost: number;
  roi_projections: ROIProjection[];
  cost_saving_opportunities: string[];
  risk_factors: string[];
}

interface Props {
  result: CostEstimationResult;
}

export default function CostEstimationResult({ result }: Props) {
  if (!result) {
    return <div>No results available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Setup Costs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Initial Setup Costs</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.setup_costs.map((cost, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cost.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cost.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${cost.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cost.timeline_months} months</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">Total Setup Cost</td>
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">
                  ${result.total_setup_cost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Costs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Operational Costs</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scaling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.operational_costs.map((cost, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cost.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cost.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${cost.monthly_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cost.scaling_factor}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">Total Monthly Operational Cost</td>
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">
                  ${result.total_monthly_operational_cost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Member Costs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Per-Member Costs</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost per Member</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Affected Segments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.member_costs.map((cost, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cost.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cost.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${cost.cost_per_member.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cost.affected_segments.join(', ')}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">Total Monthly Member Cost</td>
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">
                  ${result.total_monthly_member_cost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Projections */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">ROI Projections</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timeline</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Benefit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.roi_projections.map((proj, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{proj.timeline_months} months</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${proj.projected_revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${proj.total_cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${proj.net_benefit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{proj.roi_percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-2 gap-6">
        {/* Cost Saving Opportunities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Saving Opportunities</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <ul className="space-y-2">
              {result.cost_saving_opportunities.map((opportunity, index) => (
                <li key={index} className="text-sm text-gray-600">{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Risk Factors */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Factors</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <ul className="space-y-2">
              {result.risk_factors.map((risk, index) => (
                <li key={index} className="text-sm text-gray-600">{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
