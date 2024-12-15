from openai import OpenAI
from models.competitor_analysis import CompetitorAnalysisRequest, CompetitorAnalysisResponse
from fastapi import HTTPException
import json
import os

class CompetitorAnalysisService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def _construct_prompt(self, request: CompetitorAnalysisRequest) -> str:
        return f"""Analyze the competitive landscape for {request.company_name} in the {request.industry} industry.
        Include loyalty program details: {request.include_loyalty_program}.
        
        Provide a detailed analysis in JSON format with the following structure:
        {{
            "main_competitors": ["competitor1", "competitor2", ...],
            "competitor_details": "detailed analysis of main competitors including their market position, target demographics, and key differentiators",
            "loyalty_insights": "analysis of competitors' loyalty programs and their weaknesses",
            "strategic_recommendations": "strategic recommendations for {request.company_name}"  
        }}
        
        Ensure all fields except main_competitors are strings, not nested objects.
        Be detailed but keep all analysis in a single text field.
        """

    async def analyze_competitors(self, request: CompetitorAnalysisRequest) -> CompetitorAnalysisResponse:
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": "You are a competitive analysis expert with deep knowledge of various industries and their loyalty programs."
                },
                {
                    "role": "user",
                    "content": self._construct_prompt(request)
                }],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            # Validate result structure
            if not isinstance(result['competitor_details'], str) or not isinstance(result['loyalty_insights'], str):
                raise ValueError("API returned invalid format. Expected strings for analysis fields.")
            
            return CompetitorAnalysisResponse(
                workflow_id=request.workflow_id,
                company_name=request.company_name,
                industry=request.industry,
                main_competitors=result['main_competitors'],
                competitor_details=result['competitor_details'],
                loyalty_insights=result['loyalty_insights'],
                strategic_recommendations=result['strategic_recommendations']
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing competitors: {str(e)}")
