from .base_service import BaseService
from models.customer_analysis import CustomerAnalysisRequest, CustomerAnalysisResponse, CustomerSegment
from models.regeneration import RegenerationRequest
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

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
2. Include detailed segment descriptions
3. List key characteristics
4. Identify preferences
5. Provide actionable insights"""
        return self._original_prompt

    async def analyze_customers(self, request: CustomerAnalysisRequest) -> CustomerAnalysisResponse:
        try:
            logger.info(f"Analyzing customers for {request.company_name} in {request.industry}")
            
            result = await self._generate_openai_response(
                self._construct_prompt(request),
                self.system_message
            )
            
            logger.info("Received OpenAI response, parsing segments")
            logger.debug(f"Raw OpenAI response: {result}")
            
            if not result.get('segments') or not isinstance(result['segments'], list):
                logger.error(f"Invalid response format: {result}")
                raise ValueError("Invalid response format from OpenAI - missing segments array")
                
            segments = [CustomerSegment(**seg) for seg in result['segments']]
            logger.info(f"Successfully parsed {len(segments)} segments")
            
            response = CustomerAnalysisResponse(
                workflow_id=request.workflow_id,
                segments=segments,
                insights=result.get('insights', '')
            )
            
            logger.info("Successfully completed customer analysis")
            return response
            
        except Exception as e:
            logger.error(f"Error in analyze_customers: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=500,
                detail=f"Error in customer analysis: {str(e)}"
            )

    async def regenerate_analysis(self, request: RegenerationRequest) -> CustomerAnalysisResponse:
        try:
            logger.info(f"Regenerating analysis for workflow {request.workflow_id}")
            
            regeneration_prompt = self._construct_regeneration_prompt(
                previous_result=request.previous_result,
                user_feedback=request.user_feedback,
                original_prompt=self._original_prompt
            )
            
            result = await self._generate_openai_response(
                regeneration_prompt,
                self.system_message
            )
            
            logger.info("Received regenerated OpenAI response, parsing segments")
            logger.debug(f"Raw regenerated response: {result}")
            
            if not result.get('segments') or not isinstance(result['segments'], list):
                logger.error(f"Invalid regenerated response format: {result}")
                raise ValueError("Invalid response format from OpenAI - missing segments array")
            
            segments = [CustomerSegment(**seg) for seg in result['segments']]
            logger.info(f"Successfully parsed {len(segments)} regenerated segments")
            
            response = CustomerAnalysisResponse(
                workflow_id=request.workflow_id,
                segments=segments,
                insights=result.get('insights', '')
            )
            
            logger.info("Successfully completed customer analysis regeneration")
            return response
            
        except Exception as e:
            logger.error(f"Error in regenerate_analysis: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=500,
                detail=f"Error in customer analysis regeneration: {str(e)}"
            )