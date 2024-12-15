from pydantic import BaseModel, Field
from typing import List

class ObjectiveInput(BaseModel):
    objective: str
    rationale: str

class MechanicDetail(BaseModel):
    name: str
    description: str
    target_behavior: str
    expected_outcome: str

class ObjectiveMechanics(BaseModel):
    objective: str
    mechanics: List[MechanicDetail]

class LoyaltyMechanicsRequest(BaseModel):
    workflow_id: str
    company_name: str = Field(..., min_length=1)
    industry: str = Field(..., min_length=1)
    objectives: List[ObjectiveInput] = Field(..., min_items=1)

class LoyaltyMechanicsResponse(BaseModel):
    workflow_id: str
    company_name: str
    industry: str
    mechanics: List[ObjectiveMechanics]