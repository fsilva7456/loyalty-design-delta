from .base_service import BaseService
from models.cost_estimation import (
    CostEstimationRequest,
    CostEstimationResponse,
    SetupCost,
    OperationalCost,
    MemberCost,
    ROIProjection
)
from models.regeneration import RegenerationRequest
from fastapi import HTTPException

class CostEstimationService(BaseService):
    def __init__(self):
        super().__init__()
        self.system_message = "You are an expert in loyalty program implementation and cost analysis."

    def _construct_prompt(self, request: CostEstimationRequest) -> str:
        mechanics_text = '\n'.join(
            f"- {mech['name']}:\n" \
            f"  Description: {mech['description']}\n" \
            f"  Complexity: {mech['implementation_complexity']}"
            for mech in request.selected_mechanics
        )

        segments_text = '\n'.join(
            f"- {seg['segment_name']}:\n" \
            f"  Size: {seg['segment_size']:,} customers"
            for seg in request.customer_segments
        )

        self._original_prompt = f"""Provide a detailed cost estimation for implementing a loyalty program for {request.company_name} in the {request.industry} industry.

Selected Program Mechanics:
{mechanics_text}

Customer Segments:
{segments_text}

Total Members: {request.total_members:,}

Provide cost estimations in JSON format with the following structure:
{{
    "setup_costs": [
        {{
            "category": "Category name",
            "description": "Detailed description",
            "amount": 1000.00,
            "timeline_months": 3
        }}
    ],
    "operational_costs": [
        {{
            "category": "Category name",
            "description": "Detailed description",
            "monthly_amount": 500.00,
            "scaling_factor": "Description of how cost scales"
        }}
    ],
    "member_costs": [
        {{
            "category": "Category name",
            "description": "Detailed description",
            "cost_per_member": 0.50,
            "affected_segments": ["segment names"]
        }}
    ],
    "total_setup_cost": 10000.00,
    "total_monthly_operational_cost": 2000.00,
    "total_monthly_member_cost": 1000.00,
    "roi_projections": [
        {{
            "timeline_months": 12,
            "projected_revenue": 50000.00,
            "total_cost": 30000.00,
            "net_benefit": 20000.00,
            "roi_percentage": 66.67
        }}
    ],
    "cost_saving_opportunities": ["List of opportunities"],
    "risk_factors": ["List of risk factors"]
}}

Provide realistic cost estimates that:
1. Account for implementation complexity
2. Consider industry standards
3. Scale appropriately with member base
4. Include all major cost categories
5. Show realistic ROI projections"""
        return self._original_prompt

    async def generate_estimation(self, request: CostEstimationRequest) -> CostEstimationResponse:
        result = await self._generate_openai_response(
            self._construct_prompt(request),
            self.system_message
        )
        
        return CostEstimationResponse(
            workflow_id=request.workflow_id,
            setup_costs=[SetupCost(**cost) for cost in result['setup_costs']],
            operational_costs=[OperationalCost(**cost) for cost in result['operational_costs']],
            member_costs=[MemberCost(**cost) for cost in result['member_costs']],
            total_setup_cost=result['total_setup_cost'],
            total_monthly_operational_cost=result['total_monthly_operational_cost'],
            total_monthly_member_cost=result['total_monthly_member_cost'],
            roi_projections=[ROIProjection(**proj) for proj in result['roi_projections']],
            cost_saving_opportunities=result['cost_saving_opportunities'],
            risk_factors=result['risk_factors']
        )

    async def regenerate_estimation(self, request: RegenerationRequest) -> CostEstimationResponse:
        regeneration_prompt = self._construct_regeneration_prompt(
            previous_result=request.previous_result,
            user_feedback=request.user_feedback,
            original_prompt=self._original_prompt
        )
        
        result = await self._generate_openai_response(
            regeneration_prompt,
            self.system_message
        )
        
        return CostEstimationResponse(
            workflow_id=request.workflow_id,
            setup_costs=[SetupCost(**cost) for cost in result['setup_costs']],
            operational_costs=[OperationalCost(**cost) for cost in result['operational_costs']],
            member_costs=[MemberCost(**cost) for cost in result['member_costs']],
            total_setup_cost=result['total_setup_cost'],
            total_monthly_operational_cost=result['total_monthly_operational_cost'],
            total_monthly_member_cost=result['total_monthly_member_cost'],
            roi_projections=[ROIProjection(**proj) for proj in result['roi_projections']],
            cost_saving_opportunities=result['cost_saving_opportunities'],
            risk_factors=result['risk_factors']
        )
