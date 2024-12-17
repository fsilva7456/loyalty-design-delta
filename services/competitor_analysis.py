from .base_service import BaseService
from models.competitor_analysis import CompetitorAnalysisRequest, CompetitorAnalysisResponse, Competitor
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class CompetitorAnalysisService(BaseService):
    def __init__(self):
        try:
            super().__init__()
            self.system_message = "You are an expert in competitive analysis and market research."
            logger.info("CompetitorAnalysisService initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing CompetitorAnalysisService: {str(e)}")
            raise

    def _construct_prompt(self, request: CompetitorAnalysisRequest) -> str:
        logger.info(f"Constructing prompt for company {request.company_name} in {request.industry} industry")
        prompt = f"""Analyze the competitive landscape for {request.company_name} in the {request.industry} industry.

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
        return prompt

    def _construct_regeneration_prompt(self, previous_result: dict, user_feedback: str) -> str:
        logger.info("Constructing regeneration prompt with feedback")
        prompt = f"""Based on the previous competitor analysis and feedback, provide an updated analysis.

Previous analysis:
{previous_result}

Feedback:
{user_feedback}

Provide an updated market analysis in JSON format with the following structure:
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
1. Address the feedback provided
2. Maintain accuracy of previous insights where appropriate
3. Provide new or refined insights based on the feedback"""
        return prompt

    async def analyze_competitors(self, request: CompetitorAnalysisRequest) -> CompetitorAnalysisResponse:
        try:
            logger.info("Starting competitor analysis process")
            
            # Generate prompt
            prompt = self._construct_prompt(request)
            logger.info("Prompt constructed successfully")
            
            # Get OpenAI response
            logger.info("Calling OpenAI API")
            result = await self._generate_openai_response(
                prompt,
                self.system_message
            )
            logger.info("Received response from OpenAI")
            
            # Parse response
            logger.info("Parsing OpenAI response")
            response = CompetitorAnalysisResponse(
                workflow_id=request.workflow_id,
                competitors=[Competitor(**comp) for comp in result['competitors']],
                market_insights=result['market_insights']
            )
            
            logger.info("Successfully completed competitor analysis")
            return response
            
        except Exception as e:
            logger.error(f"Error in analyze_competitors: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=500,
                detail=f"Error in competitor analysis: {str(e)}"
            )

    async def regenerate_analysis(self, workflow_id: str, user_feedback: str, previous_result: dict) -> CompetitorAnalysisResponse:
        try:
            logger.info(f"Starting competitor analysis regeneration for workflow {workflow_id}")
            
            # Generate regeneration prompt
            prompt = self._construct_regeneration_prompt(previous_result, user_feedback)
            logger.info("Regeneration prompt constructed successfully")
            
            # Get OpenAI response
            logger.info("Calling OpenAI API for regeneration")
            result = await self._generate_openai_response(
                prompt,
                self.system_message
            )
            logger.info("Received regeneration response from OpenAI")
            
            # Parse response
            logger.info("Parsing regenerated OpenAI response")
            response = CompetitorAnalysisResponse(
                workflow_id=workflow_id,
                competitors=[Competitor(**comp) for comp in result['competitors']],
                market_insights=result['market_insights']
            )
            
            logger.info("Successfully completed competitor analysis regeneration")
            return response
            
        except Exception as e:
            logger.error(f"Error in regenerate_analysis: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=500,
                detail=f"Error in competitor analysis regeneration: {str(e)}"
            )