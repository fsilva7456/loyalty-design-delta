from fastapi import APIRouter, HTTPException, Depends
from models.loyalty_objectives import LoyaltyObjectivesRequest, LoyaltyObjectivesResponse
from services.loyalty_objectives import LoyaltyObjectivesService

router = APIRouter()

def get_loyalty_objectives_service():
    return LoyaltyObjectivesService()

@router.post("/step/loyalty_objectives", response_model=LoyaltyObjectivesResponse)
async def generate_objectives(
    request: LoyaltyObjectivesRequest,
    service: LoyaltyObjectivesService = Depends(get_loyalty_objectives_service)
):
    try:
        return await service.generate_objectives(request)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))