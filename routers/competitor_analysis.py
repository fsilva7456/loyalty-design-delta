from fastapi import APIRouter, HTTPException, Depends
from models.competitor_analysis import CompetitorAnalysisRequest, CompetitorAnalysisResponse
from services.competitor_analysis import CompetitorAnalysisService

router = APIRouter()

def get_competitor_analysis_service():
    return CompetitorAnalysisService()

@router.post("/step/competitor_analysis", response_model=CompetitorAnalysisResponse)
async def analyze_competitors(
    request: CompetitorAnalysisRequest,
    service: CompetitorAnalysisService = Depends(get_competitor_analysis_service)
):
    try:
        return await service.analyze_competitors(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))