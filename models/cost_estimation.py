from pydantic import BaseModel, Field
from typing import List

class SetupCost(BaseModel):
    category: str
    description: str
    amount: float
    timeline_months: int

class OperationalCost(BaseModel):
    category: str
    description: str
    monthly_amount: float
    scaling_factor: str

class MemberCost(BaseModel):
    category: str
    description: str
    cost_per_member: float
    affected_segments: List[str]

class ROIProjection(BaseModel):
    timeline_months: int
    projected_revenue: float
    total_cost: float
    net_benefit: float
    roi_percentage: float

class CostEstimationRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    customer_segments: List[dict] = Field(..., min_items=1)
    selected_mechanics: List[dict] = Field(..., min_items=1)
    total_members: int = Field(..., gt=0)

class CostEstimationResponse(BaseModel):
    workflow_id: str
    setup_costs: List[SetupCost]
    operational_costs: List[OperationalCost]
    member_costs: List[MemberCost]
    total_setup_cost: float
    total_monthly_operational_cost: float
    total_monthly_member_cost: float
    roi_projections: List[ROIProjection]
    cost_saving_opportunities: List[str]
    risk_factors: List[str]