from fastapi import FastAPI, HTTPException, Request
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
from openai import AsyncOpenAI
import uvicorn
import uuid
import os
import logging
import sys
from datetime import datetime

# Configure logging - use only console logging for Railway
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
logger.info("Environment variables loaded")

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

logger.info("CORS middleware configured")

# Include routers
app.include_router(competitor_analysis.router)
app.include_router(customer_analysis.router)
app.include_router(loyalty_objectives.router)
app.include_router(loyalty_mechanics.router)
app.include_router(cost_estimation.router)
app.include_router(performance_simulation.router)
app.include_router(business_case.router)

logger.info("Routers included")

# Middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming {request.method} request to {request.url.path}")
    response = await call_next(request)
    logger.info(f"Completed {request.method} request to {request.url.path} with status {response.status_code}")
    return response

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "healthy"}

@app.get("/test-openai")
async def test_openai():
    try:
        logger.info("Testing OpenAI connection")
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            logger.error("OpenAI API key not configured")
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
            
        client = AsyncOpenAI(api_key=api_key)
        logger.info("Making test request to OpenAI")
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{
                "role": "user",
                "content": "Say hello"
            }]
        )
        logger.info("Successfully received OpenAI response")
        return {"status": "success", "message": response.choices[0].message.content}
    except Exception as e:
        logger.error(f"OpenAI test failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI test failed: {str(e)}"
        )

@app.post("/start_workflow")
async def start_workflow():
    workflow_id = str(uuid.uuid4())
    logger.info(f"Created new workflow: {workflow_id}")
    return {"workflow_id": workflow_id}

if __name__ == "__main__":
    logger.info("Starting application")
    try:
        uvicorn.run(
            "main:app", 
            host="0.0.0.0", 
            port=8000, 
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        raise