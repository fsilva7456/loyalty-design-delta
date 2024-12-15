from pydantic import BaseModel, Field
from typing import List, Optional

class CustomerSegment(BaseModel):
    segment_name: str
    characteristics: str
    recommendations: str

class Demographics(BaseModel):
    age_distribution: str
    gender_split: str
    location_distribution: str

class BehavioralMetrics(BaseModel):
    average_spend: float
    purchase_frequency: float

class CustomerAnalysisRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    additional_context: Optional[str] = None

class CustomerAnalysisResponse(BaseModel):
    workflow_id: str
    company_name: str
    industry: str
    customer_segments: List[CustomerSegment]
    demographics: Demographics
    behavioral_metrics: BehavioralMetrics