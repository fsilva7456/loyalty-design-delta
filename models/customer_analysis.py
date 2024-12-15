from pydantic import BaseModel, Field
from typing import List, Optional

class CustomerSegmentInput(BaseModel):
    segment_name: str = Field(..., min_length=1)
    segment_size: int = Field(..., gt=0)
    average_spend: float = Field(..., gt=0)
    visit_frequency: float = Field(..., gt=0)

class CustomerSegmentOutput(BaseModel):
    segment_name: str
    segment_size: int
    spend_potential: float
    churn_risk: float
    growth_opportunity: str

class CustomerAnalysisRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    customer_segments: List[CustomerSegmentInput] = Field(..., min_items=1)

class CustomerAnalysisResponse(BaseModel):
    workflow_id: str
    customer_segments: List[CustomerSegmentOutput]
    insights: str