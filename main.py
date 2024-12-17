from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
import logging
from datetime import datetime

from config import settings
from utils.logging import setup_logging, log_request_details
from middleware.error_handling import error_handler

# Setup logging
setup_logging(settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Loyalty Design Delta API",
    description="API for managing loyalty program design workflows",
    version="1.0.0"
)

# Add error handling middleware
app.middleware("http")(error_handler)

# Configure CORS with environment-based settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Include routers
app.include_router(competitor_analysis.router)
app.include_router(customer_analysis.router)
app.include_router(loyalty_objectives.router)
app.include_router(loyalty_mechanics.router)
app.include_router(cost_estimation.router)
app.include_router(performance_simulation.router)
app.include_router(business_case.router)

@app.middleware("http")
async def add_correlation_id(request: Request, call_next):
    correlation_id = str(uuid.uuid4())
    logger.info(f"Processing request", extra={"correlation_id": correlation_id})
    
    try:
        log_request_details(request, logger)
        response = await call_next(request)
        
        # Add correlation ID to response headers
        response.headers["X-Correlation-ID"] = correlation_id
        
        # Log response status
        logger.info(
            f"Request completed",
            extra={
                "correlation_id": correlation_id,
                "status_code": response.status_code
            }
        )
        
        return response
    except Exception as e:
        logger.error(
            f"Request failed: {str(e)}",
            extra={"correlation_id": correlation_id}
        )
        raise

@app.middleware("http")
async def handle_options(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Max-Age"] = "3600"
        return response
    return await call_next(request)

@app.get("/healthcheck")
async def healthcheck():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }

@app.get("/debug/cors")
async def debug_cors(request: Request):
    return {
        "allowed_origins": settings.origins_list,
        "request_origin": request.headers.get("Origin"),
        "request_method": request.method,
        "environment": settings.ENVIRONMENT
    }

@app.post("/start_workflow")
async def start_workflow():
    try:
        workflow_id = str(uuid.uuid4())
        logger.info(f"Created new workflow: {workflow_id}")
        return {"workflow_id": workflow_id, "created_at": datetime.now().isoformat()}
    except Exception as e:
        logger.error(f"Failed to start workflow: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to start workflow", "detail": str(e)}
        )

if __name__ == "__main__":
    logger.info(f"Starting application in {settings.ENVIRONMENT} mode")
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=settings.is_development,
            log_level=settings.LOG_LEVEL.lower()
        )
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        raise
