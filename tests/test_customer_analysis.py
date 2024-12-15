import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_customer_analysis_endpoint_valid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "additional_context": "Focus on online shopping behavior"
    }
    
    response = client.post("/step/customer_analysis", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Validate response structure
    assert "workflow_id" in data
    assert "customer_segments" in data
    assert isinstance(data["customer_segments"], list)
    assert "demographics" in data
    assert "behavioral_metrics" in data
    
    # Validate behavioral metrics
    assert "average_spend" in data["behavioral_metrics"]
    assert "purchase_frequency" in data["behavioral_metrics"]
    
    # Validate demographics
    assert "age_distribution" in data["demographics"]
    assert "gender_split" in data["demographics"]
    assert "location_distribution" in data["demographics"]

def test_customer_analysis_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail"
    }
    
    response = client.post("/step/customer_analysis", json=payload)
    assert response.status_code == 422  # Validation error

def test_customer_analysis_endpoint_missing_fields():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company"
        # Missing required field: industry
    }
    
    response = client.post("/step/customer_analysis", json=payload)
    assert response.status_code == 422  # Validation error

def test_customer_analysis_endpoint_optional_context():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail"
        # Omitting optional additional_context
    }
    
    response = client.post("/step/customer_analysis", json=payload)
    assert response.status_code == 200