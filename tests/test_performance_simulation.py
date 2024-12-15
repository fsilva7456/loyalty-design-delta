import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_performance_simulation_endpoint_valid_input():
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
        "cost_estimates": [
            {
                "mechanic_name": "Points Program",
                "segment_name": "Premium Customers",
                "cost_per_customer": 50.0,
                "total_segment_cost": 500000.0
            }
        ],
        "customer_segments": [
            {
                "segment_name": "Premium Customers",
                "segment_size": 10000
            }
        ]
    }
    
    response = client.post("/step/performance_simulation", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "workflow_id" in data
    assert "simulation_results" in data
    assert isinstance(data["simulation_results"], list)
    assert len(data["simulation_results"]) > 0
    assert "overall_metrics" in data
    assert "assumptions" in data
    
    # Validate simulation result structure
    for result in data["simulation_results"]:
        assert "segment_name" in result
        assert "adoption_rate" in result
        assert "roi" in result
        assert "clv_improvement" in result
        assert "incremental_revenue" in result
        assert "purchase_frequency_increase" in result
        assert 0 <= result["adoption_rate"] <= 1

def test_performance_simulation_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail",
        "mechanics": [],
        "cost_estimates": [],
        "customer_segments": []
    }
    
    response = client.post("/step/performance_simulation", json=payload)
    assert response.status_code == 422  # Validation error

def test_performance_simulation_endpoint_invalid_segment_size():
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
        "cost_estimates": [
            {
                "mechanic_name": "Points Program",
                "segment_name": "Premium Customers",
                "cost_per_customer": 50.0,
                "total_segment_cost": 500000.0
            }
        ],
        "customer_segments": [
            {
                "segment_name": "Invalid Segment",
                "segment_size": 0  # Invalid: must be greater than 0
            }
        ]
    }
    
    response = client.post("/step/performance_simulation", json=payload)
    assert response.status_code == 422  # Validation error