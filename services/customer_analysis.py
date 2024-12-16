from .base_service import BaseService
from models.customer_analysis import CustomerAnalysisRequest, CustomerAnalysisResponse, CustomerSegment
from models.regeneration import RegenerationRequest
from fastapi import HTTPException

class CustomerAnalysisService(BaseService):
    def __init__(self):
        super().__init__()
        self.system_message = "You are an expert in customer segmentation and behavior analysis."

    def _construct_prompt(self, request: CustomerAnalysisRequest) -> str:
        self._original_prompt = f"""Based on the provided customer data for {request.company_name} in the {request.industry} industry,
create meaningful customer segments and insights.

Provide analysis in JSON format with the following structure:
{{
    "segments": [
        {{
            "segment_name": "Segment name",
            "description": "Segment description",
            "characteristics": ["Characteristic 1", "Characteristic 2"],
            "preferences": ["Preference 1", "Preference 2"],
            "size_percentage": 25,
            "annual_value": 50000
        }}
    ],
    "insights": "Overall customer base insights"
}}

Ensure to:
1. Create meaningful segments
2. Analyze behavior patterns
3. Identify value potential
4. Provide actionable insights"""
        return self._original_prompt

    async def analyze_customers(self, request: CustomerAnalysisRequest) -> CustomerAnalysisResponse:
        result = await self._generate_openai_response(
            self._construct_prompt(request),
            self.system_message
        )
        
        return CustomerAnalysisResponse(
            workflow_id=request.workflow_id,
            segments=[CustomerSegment(**seg) for seg in result['segments']],
            insights=result['insights']
        )

    async def regenerate_analysis(self, request: RegenerationRequest) -> CustomerAnalysisResponse:
        regeneration_prompt = self._construct_regeneration_prompt(
            previous_result=request.previous_result,
            user_feedback=request.user_feedback,
            original_prompt=self._original_prompt
        )
        
        result = await self._generate_openai_response(
            regeneration_prompt,
            self.system_message
        )
        
        return CustomerAnalysisResponse(
            workflow_id=request.workflow_id,
            segments=[CustomerSegment(**seg) for seg in result['segments']],
            insights=result['insights']
        )
