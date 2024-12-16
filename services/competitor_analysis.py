from .base_service import BaseService
from models.competitor_analysis import CompetitorAnalysisRequest, CompetitorAnalysisResponse, Competitor
from models.regeneration import RegenerationRequest
from fastapi import HTTPException

class CompetitorAnalysisService(BaseService):
    def __init__(self):
        super().__init__()
        self.system_message = "You are an expert in competitive analysis and market research."

    def _construct_prompt(self, request: CompetitorAnalysisRequest) -> str:
        self._original_prompt = f"""Analyze the competitive landscape for {request.company_name} in the {request.industry} industry.

Provide market analysis in JSON format with the following structure:
{{
    "competitors": [
        {{
            "name": "Competitor name",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"],
            "loyalty_programs": ["Program 1", "Program 2"]
        }}
    ],
    "market_insights": "Overall market analysis"
}}

Ensure to:
1. Identify key competitors
2. Analyze their strengths and weaknesses
3. Review their loyalty programs
4. Provide actionable insights"""
        return self._original_prompt

    async def analyze_competitors(self, request: CompetitorAnalysisRequest) -> CompetitorAnalysisResponse:
        result = await self._generate_openai_response(
            self._construct_prompt(request),
            self.system_message
        )
        
        return CompetitorAnalysisResponse(
            workflow_id=request.workflow_id,
            competitors=[Competitor(**comp) for comp in result['competitors']],
            market_insights=result['market_insights']
        )

    async def regenerate_analysis(self, request: RegenerationRequest) -> CompetitorAnalysisResponse:
        regeneration_prompt = self._construct_regeneration_prompt(
            previous_result=request.previous_result,
            user_feedback=request.user_feedback,
            original_prompt=self._original_prompt
        )
        
        result = await self._generate_openai_response(
            regeneration_prompt,
            self.system_message
        )
        
        return CompetitorAnalysisResponse(
            workflow_id=request.workflow_id,
            competitors=[Competitor(**comp) for comp in result['competitors']],
            market_insights=result['market_insights']
        )
