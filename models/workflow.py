from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class WorkflowBase(BaseModel):
    workflow_id: str
    status: str = "initialized"
    current_step: Optional[str] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class StepInput(BaseModel):
    workflow_id: str
    data: Dict[str, Any]