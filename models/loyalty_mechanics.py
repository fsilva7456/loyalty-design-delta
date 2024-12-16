from pydantic import BaseModel, Field
from typing import List

class MechanicsRecommendation(BaseModel):
    name: str
    description: str
    benefits: List[str]
    implementation_complexity: str
    cost_estimate: str
    expected_impact: str

class LoyaltyMechanicsRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    objectives: List[dict] = Field(..., min_items=1)
    customer_segments: List[dict] = Field(..., min_items=1)

class LoyaltyMechanicsResponse(BaseModel):
    workflow_id: str
    recommended_mechanics: List[MechanicsRecommendation]
    implementation_roadmap: str
    success_metrics: List[str]
