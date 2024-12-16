from openai import OpenAI
from models.loyalty_mechanics import (
    LoyaltyMechanicsRequest,
    LoyaltyMechanicsResponse,
    MechanicsRecommendation
)
from fastapi import HTTPException
import json
import os

class LoyaltyMechanicsService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: LoyaltyMechanicsRequest) -> str:
        objectives_text = '\n'.join(
            f"- {obj['objective']}: {obj['rationale']}"
            for obj in request.objectives
        )

        segments_text = '\n'.join(
            f"- {seg['segment_name']}\n" \
            f"  Size: {seg['segment_size']:,} customers\n" \
            f"  Spend Potential: {seg['spend_potential']:.1f}/10\n" \
            f"  Churn Risk: {seg['churn_risk']*100:.1f}%"
            for seg in request.customer_segments
        )

        return f"""Based on the following information for {request.company_name} in the {request.industry} industry:

Objectives:
{objectives_text}

Customer Segments:
{segments_text}

Provide loyalty program mechanics recommendations in JSON format with the following structure:
{{
    "recommended_mechanics": [
        {{
            "name": "Mechanic name",
            "description": "Detailed description",
            "benefits": ["Benefit 1", "Benefit 2", ...],
            "implementation_complexity": "Low/Medium/High with explanation",
            "cost_estimate": "Cost range and factors",
            "expected_impact": "Expected impact on objectives"
        }}
    ],
    "implementation_roadmap": "Phased implementation plan",
    "success_metrics": ["Metric 1", "Metric 2", ...]
}}

Provide 3-4 mechanics that:
1. Directly support the stated objectives
2. Are appropriate for the customer segments
3. Can be realistically implemented
4. Offer clear value to both business and customers
"""

    async def generate_mechanics(self, request: LoyaltyMechanicsRequest) -> LoyaltyMechanicsResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert in loyalty program design and implementation."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return LoyaltyMechanicsResponse(
                workflow_id=request.workflow_id,
                recommended_mechanics=[
                    MechanicsRecommendation(**mech)
                    for mech in result['recommended_mechanics']
                ],
                implementation_roadmap=result['implementation_roadmap'],
                success_metrics=result['success_metrics']
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating loyalty mechanics: {str(e)}")
