from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    ALLOWED_ORIGINS: str
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

    @property
    def origins_list(self) -> List[str]:
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
settings = Settings()
