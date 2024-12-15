from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
import uuid

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Loyalty Design Delta API",
    description="API for managing loyalty program design workflows",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "healthy"}

@app.post("/start_workflow")
async def start_workflow():
    workflow_id = str(uuid.uuid4())
    return {"workflow_id": workflow_id}

@app.post("/step/{step_name}")
async def execute_step(step_name: str):
    return {"message": "Step execution placeholder"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
