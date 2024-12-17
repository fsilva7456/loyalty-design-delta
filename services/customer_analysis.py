from .base_service import BaseService
from models.customer_analysis import CustomerAnalysisRequest, CustomerAnalysisResponse, CustomerSegment
from models.regeneration import RegenerationRequest
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class CustomerAnalysisService(BaseService):
    def __init__(self):
        try:
            super().__init__()
            self.system_message = "You are an expert in customer segmentation and behavior analysis."
            logger.info("CustomerAnalysisService initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing CustomerAnalysisService: {str(e)}")
            raise

    def _construct_prompt(self, request: CustomerAnalysisRequest) -> str:
        logger.info(f"Constructing prompt for company {request.company_name} in {request.industry} industry")
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
        try:
            logger.info(f"Starting customer analysis for {request.company_name}")
            
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
            
            # Validate response structure
            if not isinstance(result, dict):
                logger.error(f"Invalid response format from OpenAI: {result}")
                raise ValueError("Invalid response format from OpenAI")
                
            if 'segments' not in result or not isinstance(result['segments'], list):
                logger.error(f"Missing or invalid segments in response: {result}")
                raise ValueError("Missing or invalid segments in response")
                
            if 'insights' not in result or not isinstance(result['insights'], str):
                logger.error(f"Missing or invalid insights in response: {result}")
                raise ValueError("Missing or invalid insights in response")
            
            # Parse response
            logger.info("Parsing OpenAI response")
            response = CustomerAnalysisResponse(
                workflow_id=request.workflow_id,
                segments=[CustomerSegment(**seg) for seg in result['segments']],
                insights=result['insights']
            )
            
            logger.info(f"Successfully completed customer analysis for {request.company_name}")
            logger.info(f"Generated {len(response.segments)} segments")
            return response
            
        except Exception as e:
            logger.error(f"Error in analyze_customers: {str(e)}")
            if isinstance(e, HTTPException):
                raise e
            if isinstance(e, ValueError):
                raise HTTPException(
                    status_code=422,
                    detail=str(e)
                )
            raise HTTPException(
                status_code=500,
                detail=f"Error in customer analysis: {str(e)}"
            )

    async def regenerate_analysis(self, request: RegenerationRequest) -> CustomerAnalysisResponse:
        try:
            logger.info(f"Starting customer analysis regeneration for workflow {request.workflow_id}")
            
            # Generate regeneration prompt
            regeneration_prompt = self._construct_regeneration_prompt(
                previous_result=request.previous_result,
                user_feedback=request.user_feedback,
                original_prompt=self._original_prompt
            )
            logger.info("Regeneration prompt constructed successfully")
            
            # Get OpenAI response
            logger.info("Calling OpenAI API for regeneration")
            result = await self._generate_openai_response(
                regeneration_prompt,
                self.system_message
            )
            logger.info("Received regeneration response from OpenAI")
            
            # Parse response
            logger.info("Parsing regenerated OpenAI response")
            response = CustomerAnalysisResponse(
                workflow_id=request.workflow_id,
                segments=[CustomerSegment(**seg) for seg in result['segments']],
                insights=result['insights']
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