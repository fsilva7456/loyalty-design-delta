from fastapi import APIRouter, HTTPException, Depends
from ..models.loyalty_mechanics import LoyaltyMechanicsRequest, LoyaltyMechanicsResponse
from ..services.loyalty_mechanics import LoyaltyMechanicsService
from ..deps import get_loyalty_mechanics_service

router = APIRouter()

@router.post("/step/loyalty_mechanics", response_model=LoyaltyMechanicsResponse)
async def generate_loyalty_mechanics(
    request: LoyaltyMechanicsRequest,
    service: LoyaltyMechanicsService = Depends(get_loyalty_mechanics_service)
):
    try:
        response = await service.generate_mechanics(request)
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate loyalty mechanics")