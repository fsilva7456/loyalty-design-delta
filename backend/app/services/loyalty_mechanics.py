from typing import Dict, Any
import openai
import json
from ..models.loyalty_mechanics import LoyaltyMechanicsRequest, LoyaltyMechanicsResponse

class LoyaltyMechanicsService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        openai.api_key = api_key

    def _construct_prompt(self, request: LoyaltyMechanicsRequest) -> str:
        segments_text = "\n".join([
            f"- {seg.segment_name}: {seg.segment_size} customers, "
            f"spend potential: {seg.spend_potential}/10, "
            f"churn risk: {seg.churn_risk*100}%"
            for seg in request.customer_segments
        ])

        objectives_text = "\n".join([
            f"{i+1}. {obj}" for i, obj in enumerate(request.objectives)
        ])

        preferences = request.mechanics_preferences
        mechanics_text = ", ".join(preferences.selected_mechanics)
        custom_text = (f"\nAdditional preferences: {preferences.custom_preferences}"
                      if preferences.custom_preferences else "")

        return f"""Based on the following information:

Company Context:
Customer Segments:
{segments_text}

Loyalty Objectives:
{objectives_text}

User Preferences:
- Preferred mechanics: {mechanics_text}{custom_text}

Generate 3-5 loyalty mechanics recommendations that align with the segments and objectives.
Focus on practical implementation and measurable outcomes.
Format the response in JSON with the following structure:
{{
  "mechanics": [
    {{
      "mechanic": "Name of the mechanic",
      "description": "Detailed explanation of how it works",
      "alignment": "How it addresses objectives and segments"
    }}
  ],
  "insights": "Key implementation considerations and success factors"
}}"""

    async def generate_mechanics(
        self, 
        request: LoyaltyMechanicsRequest
    ) -> LoyaltyMechanicsResponse:
        prompt = self._construct_prompt(request)
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a loyalty program design expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        try:
            result = response.choices[0].message.content
            # Parse the JSON response and validate against the response model
            parsed_result = json.loads(result)
            return LoyaltyMechanicsResponse(
                workflow_id=request.workflow_id,
                **parsed_result
            )
        except Exception as e:
            raise ValueError(f"Failed to parse OpenAI response: {str(e)}")