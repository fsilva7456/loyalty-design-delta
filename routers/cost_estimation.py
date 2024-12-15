from fastapi import APIRouter, HTTPException, Depends
from models.cost_estimation import CostEstimationRequest, CostEstimationResponse
from services.cost_estimation import CostEstimationService

router = APIRouter()

def get_cost_estimation_service():
    return CostEstimationService()

@router.post("/step/cost_estimation", response_model=CostEstimationResponse)
async def estimate_costs(
    request: CostEstimationRequest,
    service: CostEstimationService = Depends(get_cost_estimation_service)
):
    try:
        return await service.estimate_costs(request)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))