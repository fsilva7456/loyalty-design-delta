from openai import OpenAI
from fastapi import HTTPException
import json
import os
from models.regeneration import RegenerationRequest

class BaseService:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
            
        self.client = OpenAI(
            api_key=api_key,
            # Configure default settings
            default_headers={
                "OpenAI-Organization": os.getenv('OPENAI_ORG_ID', '')  # Optional org ID
            },
            default_query={},
            timeout=60.0,  # 60 second timeout
            max_retries=2,
        )
        self._original_prompt = None

    def _construct_regeneration_prompt(
        self,
        previous_result: any,
        user_feedback: str,
        original_prompt: str
    ) -> str:
        return f"""Previous result:
{previous_result}

User feedback:
{user_feedback}

Please provide a new response that addresses this feedback while maintaining the following original requirements:
{original_prompt}

Ensure the new response:
1. Directly addresses the user's feedback
2. Maintains consistency with original requirements
3. Follows the same structured format
4. Provides clear improvements over the previous version"""

    async def _generate_openai_response(self, prompt: str, system_message: str):
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{
                    "role": "system",
                    "content": system_message
                },
                {
                    "role": "user",
                    "content": prompt
                }],
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error generating response: {str(e)}"
            )