from openai import OpenAI
from models.customer_analysis import (
    CustomerAnalysisRequest,
    CustomerAnalysisResponse,
    CustomerSegmentOutput
)
from fastapi import HTTPException
import json
import os

class CustomerAnalysisService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: CustomerAnalysisRequest) -> str:
        segments_text = "\n".join(
            f"- {seg.segment_name}: {seg.segment_size:,} customers, "
            f"average spend ${seg.average_spend:.2f}, "
            f"visit frequency {seg.visit_frequency:.1f} times per year"
            for seg in request.customer_segments
        )

        return f"""Analyze the following customer segments for {request.company_name} in the {request.industry} industry:

{segments_text}

Provide a detailed analysis in JSON format with the following structure:
{{
    "customer_segments": [
        {{
            "segment_name": "name of segment",
            "segment_size": size as integer,
            "spend_potential": float between 1-10 indicating future spend potential,
            "churn_risk": float between 0-1 indicating probability of churn,
            "growth_opportunity": "detailed growth opportunity description"
        }}
    ],
    "insights": "comprehensive analysis of overall customer base and key insights"
}}

Ensure numeric values are within specified ranges and growth opportunities are specific and actionable.
"""

    async def analyze_customers(self, request: CustomerAnalysisRequest) -> CustomerAnalysisResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are an expert in customer segmentation and behavior analysis."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            # Validate result format
            if not all(isinstance(seg.get('spend_potential', 0), (int, float)) for seg in result['customer_segments']):
                raise ValueError("Invalid spend_potential format in response")
            
            if not all(isinstance(seg.get('churn_risk', 0), (int, float)) for seg in result['customer_segments']):
                raise ValueError("Invalid churn_risk format in response")
            
            return CustomerAnalysisResponse(
                workflow_id=request.workflow_id,
                customer_segments=[
                    CustomerSegmentOutput(
                        segment_name=seg['segment_name'],
                        segment_size=next(
                            (s.segment_size for s in request.customer_segments if s.segment_name == seg['segment_name']),
                            0
                        ),
                        spend_potential=seg['spend_potential'],
                        churn_risk=seg['churn_risk'],
                        growth_opportunity=seg['growth_opportunity']
                    ) for seg in result['customer_segments']
                ],
                insights=result['insights']
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing customers: {str(e)}")