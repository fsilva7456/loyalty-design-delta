from pydantic import BaseModel, Field
from typing import List

class CustomerSegmentInput(BaseModel):
    segment_name: str
    characteristics: str

class LoyaltyObjective(BaseModel):
    objective: str
    rationale: str

class LoyaltyObjectivesRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    customer_segments: List[CustomerSegmentInput] = Field(..., min_items=1)

class LoyaltyObjectivesResponse(BaseModel):
    workflow_id: str
    company_name: str
    industry: str
    objectives: List[LoyaltyObjective]