from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import (
    competitor_analysis,
    customer_analysis,
    loyalty_objectives,
    loyalty_mechanics,
    cost_estimation,
    performance_simulation,
    business_case
)
import uvicorn
import uuid
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Loyalty Design Delta API",
    description="API for managing loyalty program design workflows",
    version="1.0.0"
)

# Get frontend URL from environment variable, default to development URL
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://loyalty-design-delta-127w0yf63-fsilva7456s-projects.vercel.app')

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,  # Production frontend
        "http://localhost:3000",  # Local development frontend
        "https://loyalty-design-delta-git-main-fsilva7456s-projects.vercel.app",  # Preview deployments
        "https://loyalty-design-delta.vercel.app"  # Production deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(competitor_analysis.router)
app.include_router(customer_analysis.router)
app.include_router(loyalty_objectives.router)
app.include_router(loyalty_mechanics.router)
app.include_router(cost_estimation.router)
app.include_router(performance_simulation.router)
app.include_router(business_case.router)

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "healthy"}

@app.post("/start_workflow")
async def start_workflow():
    workflow_id = str(uuid.uuid4())
    return {"workflow_id": workflow_id}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)