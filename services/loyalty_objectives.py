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
            f"- {segment.segment_name}: {segment.characteristics}"
            for segment in request.customer_segments
        )

        return f"""Based on the following customer segments and their characteristics, suggest the top 5 loyalty program objectives for {request.company_name} in the {request.industry} industry.

Customer Segments:
{segments_text}

Provide exactly 5 objectives with detailed rationales for each, considering customer behavior and industry trends.

Format the response as a JSON object with the following structure:
{{
    "objectives": [
        {{
            "objective": "Clear objective statement",
            "rationale": "Detailed explanation of why this objective is important and how it aligns with customer segments"
        }}
    ]
}}

Ensure each objective is:
1. Specific and measurable
2. Aligned with customer segment needs
3. Relevant to the industry
4. Actionable and practical
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
                company_name=request.company_name,
                industry=request.industry,
                objectives=[LoyaltyObjective(**obj) for obj in result['objectives']]
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating loyalty objectives: {str(e)}")