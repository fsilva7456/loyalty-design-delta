from pydantic import BaseModel, Field
from typing import List, Optional

class CompetitorAnalysisRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    include_loyalty_program: bool = False

class CompetitorAnalysisResponse(BaseModel):
    workflow_id: str
    company_name: str
    industry: str
    main_competitors: List[str]
    competitor_details: str
    loyalty_insights: str
    strategic_recommendations: str

class WorkflowState(BaseModel):
    workflow_id: str
    step_results: dict = Field(default_factory=dict)