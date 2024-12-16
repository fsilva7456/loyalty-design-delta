from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class CustomerSegment(BaseModel):
    segment_name: str
    segment_size: int
    spend_potential: float
    churn_risk: float

class MechanicsPreferences(BaseModel):
    selected_mechanics: List[str]
    custom_preferences: Optional[str] = None

class LoyaltyMechanicsRequest(BaseModel):
    workflow_id: str
    customer_segments: List[CustomerSegment]
    objectives: List[str]
    mechanics_preferences: MechanicsPreferences

class LoyaltyMechanic(BaseModel):
    mechanic: str
    description: str
    alignment: str

class LoyaltyMechanicsResponse(BaseModel):
    workflow_id: str
    mechanics: List[LoyaltyMechanic]
    insights: str