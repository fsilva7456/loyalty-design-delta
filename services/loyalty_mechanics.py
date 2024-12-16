from .base_service import BaseService
from models.loyalty_mechanics import LoyaltyMechanicsRequest, LoyaltyMechanicsResponse, MechanicsRecommendation
from models.regeneration import RegenerationRequest
from fastapi import HTTPException

class LoyaltyMechanicsService(BaseService):
    def __init__(self):
        super().__init__()
        self.system_message = "You are an expert in loyalty program design and implementation."

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

        self._original_prompt = f"""Based on the following information for {request.company_name} in the {request.industry} industry:

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
            "benefits": ["Benefit 1", "Benefit 2"],
            "implementation_complexity": "Low/Medium/High with explanation",
            "cost_estimate": "Cost range and factors",
            "expected_impact": "Expected impact on objectives"
        }}
    ],
    "implementation_roadmap": "Phased implementation plan",
    "success_metrics": ["Metric 1", "Metric 2"]
}}

Provide 3-4 mechanics that:
1. Directly support the stated objectives
2. Are appropriate for the customer segments
3. Can be realistically implemented
4. Offer clear value to both business and customers"""
        return self._original_prompt

    async def generate_mechanics(self, request: LoyaltyMechanicsRequest) -> LoyaltyMechanicsResponse:
        result = await self._generate_openai_response(
            self._construct_prompt(request),
            self.system_message
        )
        
        return LoyaltyMechanicsResponse(
            workflow_id=request.workflow_id,
            recommended_mechanics=[MechanicsRecommendation(**mech) for mech in result['recommended_mechanics']],
            implementation_roadmap=result['implementation_roadmap'],
            success_metrics=result['success_metrics']
        )

    async def regenerate_mechanics(self, request: RegenerationRequest) -> LoyaltyMechanicsResponse:
        regeneration_prompt = self._construct_regeneration_prompt(
            previous_result=request.previous_result,
            user_feedback=request.user_feedback,
            original_prompt=self._original_prompt
        )
        
        result = await self._generate_openai_response(
            regeneration_prompt,
            self.system_message
        )
        
        return LoyaltyMechanicsResponse(
            workflow_id=request.workflow_id,
            recommended_mechanics=[MechanicsRecommendation(**mech) for mech in result['recommended_mechanics']],
            implementation_roadmap=result['implementation_roadmap'],
            success_metrics=result['success_metrics']
        )
