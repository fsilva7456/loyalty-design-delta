from openai import OpenAI
from models.performance_simulation import (
    PerformanceSimulationRequest,
    PerformanceSimulationResponse,
    SimulationResult,
    OverallMetrics
)
from fastapi import HTTPException
import json
import os

class PerformanceSimulationService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: PerformanceSimulationRequest) -> str:
        mechanics_text = "\n".join(
            f"- {mech.name}: {mech.description}\n  Target behavior: {mech.target_behavior}\n  Expected outcome: {mech.expected_outcome}"
            for mech in request.mechanics
        )
        
        segments_text = "\n".join(
            f"- {seg.segment_name}: {seg.segment_size:,} customers\n  Costs: " + 
            ", ".join([f"{cost.mechanic_name}: ${cost.cost_per_customer:.2f}/customer"
                       for cost in request.cost_estimates
                       if cost.segment_name == seg.segment_name])
            for seg in request.customer_segments
        )

        return f"""Simulate the performance of the following loyalty program mechanics for {request.company_name} in the {request.industry} industry.

Loyalty Mechanics:
{mechanics_text}

Customer Segments with Cost Data:
{segments_text}

Provide a detailed performance simulation including:
1. For each segment:
   - Adoption rate (0.0 to 1.0)
   - ROI
   - CLV improvement percentage
   - Incremental revenue
   - Purchase frequency increase percentage

2. Overall program metrics:
   - Overall ROI
   - Total incremental revenue
   - Average CLV improvement

Format the response as a JSON object with the following structure:
{{
    "simulation_results": [
        {{
            "segment_name": "segment name",
            "adoption_rate": 0.75,
            "roi": 2.5,
            "clv_improvement": 15.0,
            "incremental_revenue": 1000000.0,
            "purchase_frequency_increase": 25.0
        }}
    ],
    "overall_metrics": {{
        "overall_roi": 2.8,
        "total_incremental_revenue": 5000000.0,
        "average_clv_improvement": 18.0
    }},
    "assumptions": "Detailed explanation of assumptions used in the simulation"
}}

Ensure estimates consider:
1. Industry benchmarks
2. Customer segment characteristics
3. Mechanic alignment with target behaviors
4. Implementation and adoption timelines
5. Market conditions and competition
        """

    async def simulate_performance(self, request: PerformanceSimulationRequest) -> PerformanceSimulationResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert in loyalty program performance modeling and customer behavior analysis."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return PerformanceSimulationResponse(
                workflow_id=request.workflow_id,
                company_name=request.company_name,
                industry=request.industry,
                simulation_results=[SimulationResult(**res) for res in result['simulation_results']],
                overall_metrics=OverallMetrics(**result['overall_metrics']),
                assumptions=result['assumptions']
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error simulating performance: {str(e)}")