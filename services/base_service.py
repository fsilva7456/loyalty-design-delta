from openai import OpenAI
from fastapi import HTTPException
import json
import os

class BaseService:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
            
        try:
            self.client = OpenAI(api_key=api_key)
            self._original_prompt = None
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error initializing OpenAI client: {str(e)}"
            )

    async def _generate_openai_response(self, prompt: str, system_message: str):
        try:
            response = await self.client.chat.completions.create(
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