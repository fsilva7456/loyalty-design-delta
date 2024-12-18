from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    ALLOWED_ORIGINS: str = "*"  # Default to allow all origins in case not set
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

    @property
    def origins_list(self) -> List[str]:
        # If ALLOWED_ORIGINS is "*" or not set, allow all origins
        if not self.ALLOWED_ORIGINS or self.ALLOWED_ORIGINS == "*":
            return ["*"]
            
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT.lower() == "development"

    class Config:
        env_file = ".env"

# Global settings instance
try:
    settings = Settings()
    if settings.ALLOWED_ORIGINS == "*":
        print("Warning: ALLOWED_ORIGINS not set, defaulting to allow all origins (not recommended for production)")
except Exception as e:
    print(f"Error loading settings: {e}")
    # Provide fallback settings for essential operation
    settings = Settings(
        OPENAI_API_KEY=os.getenv('OPENAI_API_KEY', ''),
        ALLOWED_ORIGINS="*",
        LOG_LEVEL="INFO",
        ENVIRONMENT="development"
    )