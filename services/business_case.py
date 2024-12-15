from openai import OpenAI
from models.business_case import (
    BusinessCaseRequest,
    BusinessCaseResponse,
    BusinessCaseContent
)
from fastapi import HTTPException
import json
import os

class BusinessCaseService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _format_currency(self, amount: float) -> str:
        return f"${amount:,.2f}"

    def _construct_prompt(self, request: BusinessCaseRequest) -> str:
        objectives_text = "\n".join(
            f"- {obj.objective}\n  Rationale: {obj.rationale}"
            for obj in request.objectives
        )

        mechanics_text = "\n".join(
            f"- {mech.name}: {mech.description}\n  Target behavior: {mech.target_behavior}\n  Expected outcome: {mech.expected_outcome}"
            for mech in request.mechanics
        )

        costs_text = "\n".join(
            f"- {cost.segment_name} - {cost.mechanic_name}: {self._format_currency(cost.total_segment_cost)}"
            for cost in request.cost_estimates
        )

        simulation_text = "\n".join(
            f"- {sim.segment_name}:\n  Adoption: {sim.adoption_rate*100:.1f}%\n  ROI: {sim.roi:.1f}x\n  CLV Improvement: {sim.clv_improvement:.1f}%\n  Incremental Revenue: {self._format_currency(sim.incremental_revenue)}"
            for sim in request.simulation_results
        )

        overall_metrics = request.overall_metrics
        metrics_text = f"Overall ROI: {overall_metrics.overall_roi:.1f}x\nTotal Incremental Revenue: {self._format_currency(overall_metrics.total_incremental_revenue)}\nAverage CLV Improvement: {overall_metrics.average_clv_improvement:.1f}%"

        return f"""Generate a comprehensive business case for the loyalty program designed for {request.company_name} in the {request.industry} industry.

Program Objectives:
{objectives_text}

Loyalty Mechanics:
{mechanics_text}

Cost Estimates:
{costs_text}

Simulation Results by Segment:
{simulation_text}

Overall Program Metrics:
{metrics_text}

Provide a structured business case with the following sections:

1. Executive Summary
- High-level overview of the program
- Key financial metrics and expected outcomes
- Strategic alignment with business goals

2. Key Insights
- Critical findings from customer and market analysis
- Competitive advantages
- Key success factors

3. Cost Breakdown
- Detailed analysis of costs
- Implementation timeline and resource requirements
- Cost management strategies

4. ROI Projections
- Detailed financial projections
- Segment-specific returns
- Timeline to profitability

5. Business Impact
- Expected impact on key metrics
- Customer behavior changes
- Market position improvements

6. Risks and Mitigation
- Key risk factors
- Mitigation strategies
- Contingency plans

Format the response as a JSON object with sections as string values:
{{
    "executive_summary": "...",
    "key_insights": "...",
    "cost_breakdown": "...",
    "roi_projections": "...",
    "business_impact": "...",
    "risks_and_mitigation": "..."
}}
"""

    async def generate_business_case(self, request: BusinessCaseRequest) -> BusinessCaseResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert business strategist specialized in loyalty program analysis and business case development."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return BusinessCaseResponse(
                workflow_id=request.workflow_id,
                business_case=BusinessCaseContent(**result)
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating business case: {str(e)}")