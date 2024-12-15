from openai import OpenAI
from models.customer_analysis import (
    CustomerAnalysisRequest,
    CustomerAnalysisResponse,
    CustomerSegment,
    Demographics,
    BehavioralMetrics
)
from fastapi import HTTPException
import json
import os

class CustomerAnalysisService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: CustomerAnalysisRequest) -> str:
        base_prompt = f"""Provide a detailed customer analysis for {request.company_name} in the {request.industry} industry.
        
        Include detailed information about:
        1. Customer Segments (provide 3-5 distinct segments)
        2. Demographics (age distribution, gender split, location distribution)
        3. Behavioral Metrics (average spend in USD, purchase frequency in times per year)
        
        Format the response as a JSON object with the following structure:
        {{
            "customer_segments": [
                {{
                    "segment_name": "segment name",
                    "characteristics": "detailed characteristics",
                    "recommendations": "targeted recommendations"
                }}
            ],
            "demographics": {{
                "age_distribution": "age breakdown",
                "gender_split": "gender distribution",
                "location_distribution": "geographical distribution"
            }},
            "behavioral_metrics": {{
                "average_spend": 123.45,
                "purchase_frequency": 12.3
            }}
        }}
        """
        
        if request.additional_context:
            base_prompt += f"\n\nAdditional context to consider: {request.additional_context}"
            
        return base_prompt

    async def analyze_customers(self, request: CustomerAnalysisRequest) -> CustomerAnalysisResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are a customer analysis expert with deep knowledge of various industries and consumer behavior."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return CustomerAnalysisResponse(
                workflow_id=request.workflow_id,
                company_name=request.company_name,
                industry=request.industry,
                customer_segments=[CustomerSegment(**segment) for segment in result['customer_segments']],
                demographics=Demographics(**result['demographics']),
                behavioral_metrics=BehavioralMetrics(**result['behavioral_metrics'])
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing customers: {str(e)}")