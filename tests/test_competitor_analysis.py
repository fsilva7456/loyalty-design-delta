import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_competitor_analysis_endpoint_valid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "include_loyalty_program": True
    }
    
    response = client.post("/step/competitor_analysis", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "workflow_id" in data
    assert "main_competitors" in data
    assert "competitor_details" in data
    assert "loyalty_insights" in data
    assert "strategic_recommendations" in data

def test_competitor_analysis_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail",
        "include_loyalty_program": True
    }
    
    response = client.post("/step/competitor_analysis", json=payload)
    assert response.status_code == 422  # Validation error

def test_competitor_analysis_endpoint_missing_fields():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company"
        # Missing required fields
    }
    
    response = client.post("/step/competitor_analysis", json=payload)
    assert response.status_code == 422  # Validation error