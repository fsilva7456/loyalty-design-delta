from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import competitor_analysis, customer_analysis, loyalty_objectives, loyalty_mechanics
from .config import settings

app = FastAPI(
    title="Loyalty Design Delta API",
    description="Backend service for loyalty program design workflows",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(competitor_analysis.router, prefix="/api", tags=["competitor-analysis"])
app.include_router(customer_analysis.router, prefix="/api", tags=["customer-analysis"])
app.include_router(loyalty_objectives.router, prefix="/api", tags=["loyalty-objectives"])
app.include_router(loyalty_mechanics.router, prefix="/api", tags=["loyalty-mechanics"])

@app.get("/")
async def root():
    return {"message": "Welcome to Loyalty Design Delta API"}