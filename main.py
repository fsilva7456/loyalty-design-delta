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
from openai import OpenAI
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

# Configure CORS with more permissive settings for Vercel preview deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://localhost:8000",
        
        # Production deployments
        "https://loyalty-design-delta.vercel.app",
        
        # Preview deployments - using wildcards to match all preview URLs
        "https://loyalty-design-delta-*.vercel.app",
        "https://loyalty-design-delta-git-*.vercel.app",
        
        # Generic pattern for all vercel preview deployments
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    allow_origin_regex="https://loyalty-design-delta.*\.vercel\.app"
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

@app.get("/test-openai")
async def test_openai():
    try:
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
            
        client = OpenAI(api_key=api_key)
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{
                "role": "user",
                "content": "Say hello"
            }]
        )
        return {"status": "success", "message": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI test failed: {str(e)}"
        )

@app.post("/start_workflow")
async def start_workflow():
    workflow_id = str(uuid.uuid4())
    return {"workflow_id": workflow_id}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)