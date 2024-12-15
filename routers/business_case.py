from fastapi import APIRouter, HTTPException, Depends
from models.business_case import BusinessCaseRequest, BusinessCaseResponse
from services.business_case import BusinessCaseService

router = APIRouter()

def get_business_case_service():
    return BusinessCaseService()

@router.post("/step/business_case", response_model=BusinessCaseResponse)
async def generate_business_case(
    request: BusinessCaseRequest,
    service: BusinessCaseService = Depends(get_business_case_service)
):
    try:
        return await service.generate_business_case(request)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))