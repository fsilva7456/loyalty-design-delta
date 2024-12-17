from fastapi import APIRouter, HTTPException, Depends, Request
from models.customer_analysis import CustomerAnalysisRequest, CustomerAnalysisResponse
from services.customer_analysis import CustomerAnalysisService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def get_customer_analysis_service():
    try:
        return CustomerAnalysisService()
    except Exception as e:
        logger.error(f"Error creating CustomerAnalysisService: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Service initialization failed: {str(e)}"
        )

@router.post("/step/customer_analysis", response_model=CustomerAnalysisResponse)
async def analyze_customers(
    request: Request,
    data: CustomerAnalysisRequest,
    service: CustomerAnalysisService = Depends(get_customer_analysis_service)
):
    try:
        # Log incoming request data
        body = await request.json()
        logger.info(f"Received customer analysis request: {body}")
        
        # Call service
        result = await service.analyze_customers(data)
        
        # Log success
        logger.info(f"Successfully generated customer analysis for workflow {data.workflow_id}")
        
        # Log response data
        logger.info(f"Response data: {result.dict()}")
        
        return result
        
    except Exception as e:
        logger.error(f"Error in customer analysis endpoint: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )