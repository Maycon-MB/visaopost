from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = Field(default="dev")
    log_level: str = Field(default="INFO")

    jwt_secret: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expires_hours: int = Field(default=24)

    database_url: str = Field(
        default="postgresql://visaopost:visaopost_dev@postgres:5432/visaopost"
    )
    redis_url: str = Field(default="redis://redis:6379/0")

    gemini_api_key: str = Field(default="")
    resend_api_key: str = Field(default="")
    resend_from_email: str = Field(default="noreply@visaopost.com.br")

    instagram_access_token: str = Field(default="")
    instagram_business_account_id: str = Field(default="")

    whatsapp_phone_id: str = Field(default="")
    whatsapp_access_token: str = Field(default="")
    whatsapp_verify_token: str = Field(default="")


@lru_cache
def get_settings() -> Settings:
    return Settings()
