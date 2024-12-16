from .base_service import BaseService
from models.loyalty_objectives import LoyaltyObjectivesRequest, LoyaltyObjectivesResponse, LoyaltyObjective
from models.regeneration import RegenerationRequest
from fastapi import HTTPException

class LoyaltyObjectivesService(BaseService):
    def __init__(self):
        super().__init__()
        self.system_message = "You are an expert in loyalty program strategy and customer engagement."

    def _construct_prompt(self, request: LoyaltyObjectivesRequest) -> str:
        segments_text = "\n".join(
            f"- {seg.segment_name}:\n" \
            f"  Size: {seg.segment_size:,} customers\n" \
            f"  Spend Potential: {seg.spend_potential:.1f}/10\n" \
            f"  Churn Risk: {seg.churn_risk*100:.1f}%\n" \
            f"  Growth Opportunity: {seg.growth_opportunity}"
            for seg in request.customer_segments
        )

        self._original_prompt = f"""Based on the following customer segments for {request.company_name} in the {request.industry} industry:

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
5. Tied to business value"""
        return self._original_prompt

    async def generate_objectives(self, request: LoyaltyObjectivesRequest) -> LoyaltyObjectivesResponse:
        result = await self._generate_openai_response(
            self._construct_prompt(request),
            self.system_message
        )
        
        return LoyaltyObjectivesResponse(
            workflow_id=request.workflow_id,
            objectives=[LoyaltyObjective(**obj) for obj in result['objectives']],
            insights=result['insights']
        )
    
    async def regenerate_objectives(self, request: RegenerationRequest) -> LoyaltyObjectivesResponse:
        regeneration_prompt = self._construct_regeneration_prompt(
            previous_result=request.previous_result,
            user_feedback=request.user_feedback,
            original_prompt=self._original_prompt
        )
        
        result = await self._generate_openai_response(
            regeneration_prompt,
            self.system_message
        )
        
        return LoyaltyObjectivesResponse(
            workflow_id=request.workflow_id,
            objectives=[LoyaltyObjective(**obj) for obj in result['objectives']],
            insights=result['insights']
        )
