from fastapi import APIRouter, HTTPException, Depends, Request
from models.competitor_analysis import (
    CompetitorAnalysisRequest,
    CompetitorAnalysisResponse,
    CompetitorAnalysisRegenerationRequest
)
from services.competitor_analysis import CompetitorAnalysisService
from fastapi.encoders import jsonable_encoder
from pprint import pformat
import logging
import json

router = APIRouter()
logger = logging.getLogger(__name__)

def get_competitor_analysis_service():
    try:
        return CompetitorAnalysisService()
    except Exception as e:
        logger.error(f"Error creating CompetitorAnalysisService: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Service initialization failed: {str(e)}"
        )

@router.post("/step/competitor_analysis", response_model=CompetitorAnalysisResponse)
async def analyze_competitors(
    request: Request,
    data: CompetitorAnalysisRequest,
    service: CompetitorAnalysisService = Depends(get_competitor_analysis_service)
):
    try:
        # Log incoming request data
        body = await request.json()
        logger.info(f"Received competitor analysis request: {body}")
        
        # Call service
        result = await service.analyze_competitors(data)
        logger.info("Successfully generated competitor analysis")
        return result
        
    except Exception as e:
        logger.error(f"Error in competitor analysis endpoint: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@router.post("/step/competitor_analysis/regenerate", response_model=CompetitorAnalysisResponse)
async def regenerate_competitor_analysis(
    request: Request,
    service: CompetitorAnalysisService = Depends(get_competitor_analysis_service)
):
    try:
        # Log raw request body first
        raw_body = await request.body()
        logger.info(f"Raw request body: {raw_body.decode()}")
        
        # Parse the JSON body
        body = await request.json()
        logger.info(f"Parsed request body: \n{pformat(body)}")
        
        # Log the expected schema
        schema = CompetitorAnalysisRegenerationRequest.model_json_schema()
        logger.info(f"Expected schema: \n{pformat(schema)}")
        
        # Validate against the model
        data = CompetitorAnalysisRegenerationRequest(**body)
        logger.info("Request validation successful")
        
        # Call service with regeneration data
        result = await service.regenerate_analysis(
            workflow_id=data.workflow_id,
            feedback=data.feedback,
            previous_result=data.previous_result
        )
        
        logger.info("Successfully regenerated competitor analysis")
        return result
        
    except Exception as e:
        logger.error(f"Error in competitor analysis regeneration: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Error regenerating analysis: {str(e)}"
        )