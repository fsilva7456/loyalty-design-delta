from pydantic import BaseModel, Field
from typing import List

class LoyaltyObjective(BaseModel):
    objective: str
    rationale: str

class CustomerSegmentInput(BaseModel):
    segment_name: str = Field(..., min_length=1)
    segment_size: int = Field(..., gt=0)
    spend_potential: float = Field(..., ge=0)
    churn_risk: float = Field(..., ge=0, le=1)
    growth_opportunity: str

class LoyaltyObjectivesRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    customer_segments: List[CustomerSegmentInput] = Field(..., min_items=1)

class LoyaltyObjectivesResponse(BaseModel):
    workflow_id: str
    objectives: List[LoyaltyObjective]
    insights: str