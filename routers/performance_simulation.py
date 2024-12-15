from fastapi import APIRouter, HTTPException, Depends
from models.performance_simulation import PerformanceSimulationRequest, PerformanceSimulationResponse
from services.performance_simulation import PerformanceSimulationService

router = APIRouter()

def get_performance_simulation_service():
    return PerformanceSimulationService()

@router.post("/step/performance_simulation", response_model=PerformanceSimulationResponse)
async def simulate_performance(
    request: PerformanceSimulationRequest,
    service: PerformanceSimulationService = Depends(get_performance_simulation_service)
):
    try:
        return await service.simulate_performance(request)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))