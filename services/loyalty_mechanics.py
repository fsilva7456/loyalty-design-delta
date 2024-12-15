from openai import OpenAI
from models.loyalty_mechanics import (
    LoyaltyMechanicsRequest,
    LoyaltyMechanicsResponse,
    ObjectiveMechanics,
    MechanicDetail
)
from fastapi import HTTPException
import json
import os

class LoyaltyMechanicsService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: LoyaltyMechanicsRequest) -> str:
        objectives_text = "\n".join(
            f"- {obj.objective}\nRationale: {obj.rationale}\n"
            for obj in request.objectives
        )

        return f"""Based on the following loyalty program objectives for {request.company_name} in the {request.industry} industry, suggest 3 loyalty mechanics for each objective.

Objectives:
{objectives_text}

For each objective, provide exactly 3 loyalty mechanics. Format the response as a JSON object with the following structure:
{{
    "mechanics": [
        {{
            "objective": "Original objective statement",
            "mechanics": [
                {{
                    "name": "Name of the mechanic",
                    "description": "Detailed description of how the mechanic works",
                    "target_behavior": "Specific behavior this mechanic aims to encourage",
                    "expected_outcome": "Expected results and impact on business metrics"
                }}
            ]
        }}
    ]
}}

Ensure each mechanic:
1. Is specific and implementable
2. Directly supports its objective
3. Has clear behavioral targets
4. Includes measurable outcomes
5. Is relevant to the industry
        """

    async def generate_mechanics(self, request: LoyaltyMechanicsRequest) -> LoyaltyMechanicsResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert in loyalty program design and behavioral economics."
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
                company_name=request.company_name,
                industry=request.industry,
                mechanics=[
                    ObjectiveMechanics(
                        objective=mech["objective"],
                        mechanics=[MechanicDetail(**m) for m in mech["mechanics"]]
                    ) for mech in result["mechanics"]
                ]
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating loyalty mechanics: {str(e)}")