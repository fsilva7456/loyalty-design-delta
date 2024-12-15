import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_loyalty_mechanics_endpoint_valid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "objectives": [
            {
                "objective": "Increase customer retention",
                "rationale": "Improve long-term customer value"
            },
            {
                "objective": "Drive referral sales",
                "rationale": "Leverage word-of-mouth marketing"
            }
        ]
    }
    
    response = client.post("/step/loyalty_mechanics", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "workflow_id" in data
    assert "mechanics" in data
    assert isinstance(data["mechanics"], list)
    assert len(data["mechanics"]) > 0
    
    # Validate mechanics structure
    for objective_mechanics in data["mechanics"]:
        assert "objective" in objective_mechanics
        assert "mechanics" in objective_mechanics
        assert isinstance(objective_mechanics["mechanics"], list)
        assert len(objective_mechanics["mechanics"]) > 0
        
        for mechanic in objective_mechanics["mechanics"]:
            assert "name" in mechanic
            assert "description" in mechanic
            assert "target_behavior" in mechanic
            assert "expected_outcome" in mechanic

def test_loyalty_mechanics_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail",
        "objectives": []
    }
    
    response = client.post("/step/loyalty_mechanics", json=payload)
    assert response.status_code == 422  # Validation error

def test_loyalty_mechanics_endpoint_missing_objectives():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "objectives": []  # Invalid: empty list
    }
    
    response = client.post("/step/loyalty_mechanics", json=payload)
    assert response.status_code == 422  # Validation error