from pydantic import BaseModel, Field
from typing import List

class SimulationResultInput(BaseModel):
    segment_name: str
    adoption_rate: float
    roi: float
    clv_improvement: float
    incremental_revenue: float
    purchase_frequency_increase: float

class OverallMetricsInput(BaseModel):
    overall_roi: float
    total_incremental_revenue: float
    average_clv_improvement: float

class CostEstimateInput(BaseModel):
    mechanic_name: str
    segment_name: str
    cost_per_customer: float
    total_segment_cost: float

class ObjectiveInput(BaseModel):
    objective: str
    rationale: str

class MechanicInput(BaseModel):
    name: str
    description: str
    target_behavior: str
    expected_outcome: str

class BusinessCaseContent(BaseModel):
    executive_summary: str
    key_insights: str
    cost_breakdown: str
    roi_projections: str
    business_impact: str
    risks_and_mitigation: str

class BusinessCaseRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    simulation_results: List[SimulationResultInput] = Field(..., min_items=1)
    overall_metrics: OverallMetricsInput
    cost_estimates: List[CostEstimateInput] = Field(..., min_items=1)
    objectives: List[ObjectiveInput] = Field(..., min_items=1)
    mechanics: List[MechanicInput] = Field(..., min_items=1)

class BusinessCaseResponse(BaseModel):
    workflow_id: str
    business_case: BusinessCaseContent