from openai import OpenAI
from models.cost_estimation import (
    CostEstimationRequest,
    CostEstimationResponse,
    CostEstimate
)
from fastapi import HTTPException
import json
import os

class CostEstimationService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: CostEstimationRequest) -> str:
        mechanics_text = "\n".join(
            f"- {mech.name}: {mech.description}\n  Target behavior: {mech.target_behavior}\n  Expected outcome: {mech.expected_outcome}"
            for mech in request.mechanics
        )
        
        segments_text = "\n".join(
            f"- {seg.segment_name}: {seg.segment_size:,} customers"
            for seg in request.customer_segments
        )

        return f"""Estimate the costs of implementing the following loyalty mechanics for {request.company_name} in the {request.industry} industry.

Loyalty Mechanics:
{mechanics_text}

Customer Segments:
{segments_text}

Provide a detailed cost analysis including:
1. Cost per customer for each mechanic and segment
2. Total cost per segment
3. Overall program cost

Format the response as a JSON object with the following structure:
{{
    "cost_estimates": [
        {{
            "mechanic_name": "name of the mechanic",
            "segment_name": "name of the segment",
            "cost_per_customer": 123.45,
            "total_segment_cost": 123456.78
        }}
    ],
    "overall_program_cost": 1234567.89,
    "rationale": "Detailed explanation of cost estimates and assumptions"
}}

Ensure estimates consider:
1. Implementation costs
2. Reward/incentive costs
3. Operational overhead
4. Industry benchmarks
5. Customer segment characteristics
        """

    async def estimate_costs(self, request: CostEstimationRequest) -> CostEstimationResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert in loyalty program cost analysis and financial modeling."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return CostEstimationResponse(
                workflow_id=request.workflow_id,
                company_name=request.company_name,
                industry=request.industry,
                cost_estimates=[CostEstimate(**est) for est in result['cost_estimates']],
                overall_program_cost=result['overall_program_cost'],
                rationale=result['rationale']
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error estimating costs: {str(e)}")