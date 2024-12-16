from openai import OpenAI
from fastapi import HTTPException
import json
import os
import logging

logger = logging.getLogger(__name__)

class BaseService:
    def __init__(self):
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                logger.error("OpenAI API key not configured")
                raise HTTPException(
                    status_code=500,
                    detail="OpenAI API key not configured"
                )
                
            self.client = OpenAI(api_key=api_key)
            self._original_prompt = None
            logger.info("OpenAI client initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing BaseService: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error initializing OpenAI client: {str(e)}"
            )

    async def _generate_openai_response(self, prompt: str, system_message: str):
        try:
            logger.info("Making request to OpenAI API")
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
            
            logger.info("Successfully received OpenAI response")
            result = json.loads(response.choices[0].message.content)
            logger.info("Successfully parsed OpenAI response")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing OpenAI response: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error parsing OpenAI response: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Error in OpenAI request: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error generating response: {str(e)}"
            )