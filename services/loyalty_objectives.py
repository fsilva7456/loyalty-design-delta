from openai import OpenAI
from models.loyalty_objectives import (
    LoyaltyObjectivesRequest,
    LoyaltyObjectivesResponse,
    LoyaltyObjective
)
from fastapi import HTTPException
import json
import os

class LoyaltyObjectivesService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: LoyaltyObjectivesRequest) -> str:
        segments_text = "\n".join(
            f"- {seg.segment_name}:\n" \
            f"  Size: {seg.segment_size:,} customers\n" \
            f"  Spend Potential: {seg.spend_potential:.1f}/10\n" \
            f"  Churn Risk: {seg.churn_risk*100:.1f}%\n" \
            f"  Growth Opportunity: {seg.growth_opportunity}"
            for seg in request.customer_segments
        )

        return f"""Based on the following customer segments for {request.company_name} in the {request.industry} industry:

{segments_text}

Provide a detailed loyalty program strategy in JSON format with the following structure:
{{
    "objectives": [
        {{
            "objective": "Clear objective statement",
            "rationale": "Detailed explanation of why this objective is important and how it aligns with customer segments"
        }}
    ],
    "insights": "Overall insights and observations about the customer base and how the objectives work together"
}}

Provide exactly 3-5 objectives that are:
1. Specific and measurable
2. Aligned with customer segment needs
3. Focused on increasing loyalty and retention
4. Realistic and achievable
5. Tied to business value
"""

    async def generate_objectives(self, request: LoyaltyObjectivesRequest) -> LoyaltyObjectivesResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert in loyalty program strategy and customer engagement."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return LoyaltyObjectivesResponse(
                workflow_id=request.workflow_id,
                objectives=[LoyaltyObjective(**obj) for obj in result['objectives']],
                insights=result['insights']
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating loyalty objectives: {str(e)}")