import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_business_case_endpoint_valid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "Test Company",
        "industry": "Retail",
        "simulation_results": [
            {
                "segment_name": "Premium Customers",
                "adoption_rate": 0.75,
                "roi": 2.5,
                "clv_improvement": 15.0,
                "incremental_revenue": 1000000.0,
                "purchase_frequency_increase": 25.0
            }
        ],
        "overall_metrics": {
            "overall_roi": 2.8,
            "total_incremental_revenue": 5000000.0,
            "average_clv_improvement": 18.0
        },
        "cost_estimates": [
            {
                "mechanic_name": "Points Program",
                "segment_name": "Premium Customers",
                "cost_per_customer": 50.0,
                "total_segment_cost": 500000.0
            }
        ],
        "objectives": [
            {
                "objective": "Increase customer retention",
                "rationale": "Improve long-term customer value"
            }
        ],
        "mechanics": [
            {
                "name": "Points Program",
                "description": "Earn points on purchases",
                "target_behavior": "Increase purchase frequency",
                "expected_outcome": "20% increase in visit frequency"
            }
        ]
    }
    
    response = client.post("/step/business_case", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "workflow_id" in data
    assert "business_case" in data
    
    # Validate business case structure
    business_case = data["business_case"]
    assert "executive_summary" in business_case
    assert "key_insights" in business_case
    assert "cost_breakdown" in business_case
    assert "roi_projections" in business_case
    assert "business_impact" in business_case
    assert "risks_and_mitigation" in business_case

def test_business_case_endpoint_invalid_input():
    payload = {
        "workflow_id": "test-workflow-123",
        "company_name": "",  # Invalid: empty string
        "industry": "Retail",
        "simulation_results": [],
        "overall_metrics": {
            "overall_roi": 0.0,
            "total_incremental_revenue": 0.0,
            "average_clv_improvement": 0.0
        },
        "cost_estimates": [],
        "objectives": [],
        "mechanics": []
    }
    
    response = client.post("/step/business_case", json=payload)
    assert response.status_code == 422  # Validation error