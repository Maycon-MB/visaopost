"""Settings do tenant editáveis pelo dono via PWA `/settings`."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _validate_weekdays(days: list[int]) -> list[int]:
    if not days:
        raise ValueError("escolha pelo menos 1 dia")
    if any(d < 1 or d > 7 for d in days):
        raise ValueError("dias da semana devem estar entre 1 (seg) e 7 (dom)")
    return sorted(set(days))


class TenantSettings(BaseModel):
    """Snapshot atual das configurações do tenant. Read-only."""

    model_config = ConfigDict(frozen=True)

    send_hour: int = Field(ge=0, le=23, description="Hora local de envio do email (0-23)")
    publish_hour: int = Field(ge=0, le=23, description="Hora local de publicação no IG (0-23)")
    active_weekdays: list[int] = Field(
        description="Dias ativos ISO: 1=seg, 7=dom. Cron pula dia se não estiver na lista."
    )
    extra_instructions: str | None = Field(
        default=None,
        max_length=2000,
        description="Instruções livres pro Gemini. Ex.: 'evitar vermelho', 'mencionar Black Friday'.",
    )
    whatsapp_faq: str | None = Field(
        default=None,
        max_length=4000,
        description="Regras/FAQ do bot de WhatsApp (horários, convênios, garantia, quando escalar).",
    )
    owner_email: str | None = None
    timezone: str = "America/Sao_Paulo"

    @field_validator("active_weekdays")
    @classmethod
    def _validate_days(cls, v: list[int]) -> list[int]:
        return _validate_weekdays(v)


class TenantSettingsUpdate(BaseModel):
    """Payload PATCH parcial. None = não mexe nesse campo."""

    model_config = ConfigDict(frozen=True)

    send_hour: int | None = Field(default=None, ge=0, le=23)
    publish_hour: int | None = Field(default=None, ge=0, le=23)
    active_weekdays: list[int] | None = None
    extra_instructions: str | None = Field(default=None, max_length=2000)
    whatsapp_faq: str | None = Field(default=None, max_length=4000)
    owner_email: str | None = Field(default=None, max_length=120)

    @field_validator("active_weekdays")
    @classmethod
    def _validate_days(cls, v: list[int] | None) -> list[int] | None:
        return None if v is None else _validate_weekdays(v)

    @field_validator("owner_email")
    @classmethod
    def _validate_email(cls, v: str | None) -> str | None:
        if v is None or not v.strip():
            return None
        s = v.strip().lower()
        if "@" not in s or "." not in s.split("@")[-1]:
            raise ValueError("email inválido")
        return s
