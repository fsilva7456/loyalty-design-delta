from fastapi import APIRouter, HTTPException, Depends
from models.loyalty_mechanics import LoyaltyMechanicsRequest, LoyaltyMechanicsResponse
from services.loyalty_mechanics import LoyaltyMechanicsService

router = APIRouter()

def get_loyalty_mechanics_service():
    return LoyaltyMechanicsService()

@router.post("/step/loyalty_mechanics", response_model=LoyaltyMechanicsResponse)
async def generate_mechanics(
    request: LoyaltyMechanicsRequest,
    service: LoyaltyMechanicsService = Depends(get_loyalty_mechanics_service)
):
    try:
        return await service.generate_mechanics(request)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
