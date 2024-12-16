from pydantic import BaseModel, Field
from typing import List

class CustomerSegment(BaseModel):
    segment_name: str
    description: str
    characteristics: List[str]
    preferences: List[str]
    size_percentage: float
    annual_value: float

class CustomerAnalysisRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)

class CustomerAnalysisResponse(BaseModel):
    workflow_id: str
    segments: List[CustomerSegment]
    insights: str