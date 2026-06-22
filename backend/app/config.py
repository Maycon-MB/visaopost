from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = Field(default="dev")
    log_level: str = Field(default="INFO")

    frontend_url: str = Field(
        default="http://localhost:5173",
        description="URL pública do PWA — usada pra montar `approval_url` no email.",
    )
    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,http://localhost:4321,http://127.0.0.1:4321",
        description="Lista CSV de origens liberadas pelo CORSMiddleware.",
    )

    jwt_secret: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expires_hours: int = Field(default=24)
    session_expires_hours: int = Field(default=168, description="TTL do token de sessão do painel (7 dias).")
    reset_expires_minutes: int = Field(default=60, description="TTL do link de redefinição de senha.")

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
    whatsapp_app_secret: str = Field(default="")


@lru_cache
def get_settings() -> Settings:
    return Settings()
