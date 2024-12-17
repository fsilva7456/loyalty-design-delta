from pydantic import BaseModel, Field
from typing import Any

class RegenerationRequest(BaseModel):
    workflow_id: str
    user_feedback: str = Field(..., min_length=1)
    previous_result: Any
    original_request: Any