from fastapi import APIRouter, HTTPException, Depends
from models.customer_analysis import CustomerAnalysisRequest, CustomerAnalysisResponse
from services.customer_analysis import CustomerAnalysisService

router = APIRouter()

def get_customer_analysis_service():
    return CustomerAnalysisService()

@router.post("/step/customer_analysis", response_model=CustomerAnalysisResponse)
async def analyze_customers(
    request: CustomerAnalysisRequest,
    service: CustomerAnalysisService = Depends(get_customer_analysis_service)
):
    try:
        return await service.analyze_customers(request)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))