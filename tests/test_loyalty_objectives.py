import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_loyalty_objectives_endpoint_valid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "customer_segments": [
            {
                "segment_name": "Premium Shoppers",
                "characteristics": "High income, frequent purchases"
            },
            {
                "segment_name": "Value Seekers",
                "characteristics": "Price sensitive, deal-driven"
            }
        ]
    }
    
    response = client.post("/step/loyalty_objectives", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "workflow_id" in data
    assert "objectives" in data
    assert isinstance(data["objectives"], list)
    assert len(data["objectives"]) > 0
    
    # Validate objective structure
    for objective in data["objectives"]:
        assert "objective" in objective
        assert "rationale" in objective
        assert isinstance(objective["objective"], str)
        assert isinstance(objective["rationale"], str)

def test_loyalty_objectives_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail",
        "customer_segments": []
    }
    
    response = client.post("/step/loyalty_objectives", json=payload)
    assert response.status_code == 422  # Validation error

def test_loyalty_objectives_endpoint_missing_segments():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "customer_segments": []  # Invalid: empty list
    }
    
    response = client.post("/step/loyalty_objectives", json=payload)
    assert response.status_code == 422  # Validation error