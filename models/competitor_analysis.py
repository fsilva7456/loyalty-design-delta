from pydantic import BaseModel, Field
from typing import List, Dict, Any

class Competitor(BaseModel):
    name: str
    strengths: List[str]
    weaknesses: List[str]
    loyalty_programs: List[str]

class CompetitorAnalysisRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)

class CompetitorAnalysisResponse(BaseModel):
    workflow_id: str
    competitors: List[Competitor]
    market_insights: str

class CompetitorAnalysisRegenerationRequest(BaseModel):
    workflow_id: str
    feedback: str = Field(..., min_length=1)
    previous_result: Dict[str, Any] = Field(...)