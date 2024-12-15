from pydantic import BaseModel, Field
from typing import List

class MechanicInput(BaseModel):
    name: str
    description: str
    target_behavior: str
    expected_outcome: str

class CustomerSegmentInput(BaseModel):
    segment_name: str
    segment_size: int = Field(..., gt=0)

class CostEstimate(BaseModel):
    mechanic_name: str
    segment_name: str
    cost_per_customer: float
    total_segment_cost: float

class CostEstimationRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    mechanics: List[MechanicInput] = Field(..., min_items=1)
    customer_segments: List[CustomerSegmentInput] = Field(..., min_items=1)

class CostEstimationResponse(BaseModel):
    workflow_id: str
    company_name: str
    industry: str
    cost_estimates: List[CostEstimate]
    overall_program_cost: float
    rationale: str