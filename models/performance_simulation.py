from pydantic import BaseModel, Field
from typing import List

class MechanicInput(BaseModel):
    name: str
    description: str
    target_behavior: str
    expected_outcome: str

class CostEstimateInput(BaseModel):
    mechanic_name: str
    segment_name: str
    cost_per_customer: float
    total_segment_cost: float

class CustomerSegmentInput(BaseModel):
    segment_name: str
    segment_size: int = Field(..., gt=0)

class SimulationResult(BaseModel):
    segment_name: str
    adoption_rate: float = Field(..., ge=0, le=1)
    roi: float
    clv_improvement: float
    incremental_revenue: float
    purchase_frequency_increase: float

class OverallMetrics(BaseModel):
    overall_roi: float
    total_incremental_revenue: float
    average_clv_improvement: float

class PerformanceSimulationRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    mechanics: List[MechanicInput] = Field(..., min_items=1)
    cost_estimates: List[CostEstimateInput] = Field(..., min_items=1)
    customer_segments: List[CustomerSegmentInput] = Field(..., min_items=1)

class PerformanceSimulationResponse(BaseModel):
    workflow_id: str
    company_name: str
    industry: str
    simulation_results: List[SimulationResult]
    overall_metrics: OverallMetrics
    assumptions: str