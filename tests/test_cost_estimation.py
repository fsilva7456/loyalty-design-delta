import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_cost_estimation_endpoint_valid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "mechanics": [
            {
                "name": "Points Program",
                "description": "Earn points on purchases",
                "target_behavior": "Increase purchase frequency",
                "expected_outcome": "20% increase in visit frequency"
            }
        ],
        "customer_segments": [
            {
                "segment_name": "Premium Customers",
                "segment_size": 10000
            }
        ]
    }
    
    response = client.post("/step/cost_estimation", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "workflow_id" in data
    assert "cost_estimates" in data
    assert isinstance(data["cost_estimates"], list)
    assert len(data["cost_estimates"]) > 0
    assert "overall_program_cost" in data
    assert "rationale" in data
    
    # Validate cost estimate structure
    for estimate in data["cost_estimates"]:
        assert "mechanic_name" in estimate
        assert "segment_name" in estimate
        assert "cost_per_customer" in estimate
        assert "total_segment_cost" in estimate
        assert isinstance(estimate["cost_per_customer"], float)
        assert isinstance(estimate["total_segment_cost"], float)

def test_cost_estimation_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail",
        "mechanics": [],
        "customer_segments": []
    }
    
    response = client.post("/step/cost_estimation", json=payload)
    assert response.status_code == 422  # Validation error

def test_cost_estimation_endpoint_invalid_segment_size():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "mechanics": [
            {
                "name": "Points Program",
                "description": "Earn points on purchases",
                "target_behavior": "Increase purchase frequency",
                "expected_outcome": "20% increase in visit frequency"
            }
        ],
        "customer_segments": [
            {
                "segment_name": "Invalid Segment",
                "segment_size": 0  # Invalid: must be greater than 0
            }
        ]
    }
    
    response = client.post("/step/cost_estimation", json=payload)
    assert response.status_code == 422  # Validation error