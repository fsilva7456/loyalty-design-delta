from pydantic import BaseModel, Field
from typing import Any, Optional

class RegenerationRequest(BaseModel):
    workflow_id: str
    previous_result: Any
    user_feedback: str = Field(..., min_length=1)
    original_request: Any