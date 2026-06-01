"""Auth do painel do dono: login por senha, /me, esqueci-senha e redefinir.

Tenant vem do token de sessão (não mais de ?tenant=). Login bloqueia se a
assinatura do tenant estiver suspensa/cancelada (inadimplência/cancelamento).
"""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import get_settings
from app.db.repositories import admin_users as admin_repo
from app.db.repositories import password_resets as reset_repo
from app.db.repositories.tenants import get_tenant_access
from app.logging import get_logger
from app.models.admin import (
    AdminUser,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    ProfileUpdate,
    ResetPasswordRequest,
)
from app.services import auth as auth_svc
from app.services.email import send_password_reset_email

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = get_logger(__name__)

_bearer = HTTPBearer(auto_error=False)

# Assinaturas que ainda permitem entrar no painel.
_ALLOWED_SUBSCRIPTION = {"active", "past_due"}


@dataclass(frozen=True)
class Principal:
    """Identidade autenticada extraída do token de sessão."""

    user_id: UUID
    tenant_id: UUID
    role: str


async def current_principal(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> Principal:
    """Valida o Bearer token e devolve o Principal. 401 se ausente/inválido."""
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="não autenticado")
    try:
        payload = auth_svc.verify_session_token(creds.credentials)
    except auth_svc.InvalidSessionToken as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    return Principal(
        user_id=UUID(payload["sub"]),
        tenant_id=UUID(payload["tenant_id"]),
        role=payload["role"],
    )


async def current_tenant_id(principal: Principal = Depends(current_principal)) -> UUID:
    """Atalho pras rotas que só precisam do tenant do usuário logado."""
    return principal.tenant_id


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    candidates = await admin_repo.list_by_identifier(payload.identifier)
    user = next(
        (
            u for u in candidates
            if u.status == "active" and auth_svc.verify_password(payload.password, u.password_hash)
        ),
        None,
    )
    if user is None:
        # Mensagem genérica: não revela se o email existe.
        raise HTTPException(status_code=401, detail="email ou senha incorretos")

    access = await get_tenant_access(user.tenant_id)
    if access is None or not access[0] or access[1] not in _ALLOWED_SUBSCRIPTION:
        raise HTTPException(
            status_code=403,
            detail="acesso suspenso. fale com o suporte da VisãoPost.",
        )

    await admin_repo.update_last_login(user.id)
    token = auth_svc.sign_session_token(user_id=user.id, tenant_id=user.tenant_id, role=user.role)
    logger.info("auth.login", user_id=str(user.id), tenant_id=str(user.tenant_id))
    public = AdminUser(**user.model_dump(exclude={"password_hash"}))
    return LoginResponse(access_token=token, user=public)


@router.get("/me", response_model=AdminUser)
async def me(principal: Principal = Depends(current_principal)) -> AdminUser:
    user = await admin_repo.get_by_id(principal.user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="usuário não encontrado")
    return user


@router.patch("/me", response_model=AdminUser)
async def update_me(
    payload: ProfileUpdate,
    principal: Principal = Depends(current_principal),
) -> AdminUser:
    user = await admin_repo.update_profile(
        principal.user_id,
        name=payload.name,
        phone=payload.phone,
    )
    if user is None:
        raise HTTPException(status_code=404, detail="usuário não encontrado")
    logger.info("auth.update_profile", user_id=str(principal.user_id))
    return user


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest) -> dict[str, bool]:
    """Sempre responde ok (não revela se o email existe). Manda link se existir."""
    settings = get_settings()
    users = await admin_repo.list_by_email(payload.email)
    for user in users:
        if user.status == "disabled":
            continue
        raw, token_hash, expires_at = auth_svc.generate_reset_token()
        await reset_repo.create_reset(user.id, token_hash, expires_at)
        reset_url = f"{settings.frontend_url}/redefinir-senha?token={raw}"
        try:
            send_password_reset_email(
                to=user.email,
                reset_url=reset_url,
                name=user.name,
                business_name="Ótica Di Lorenzo",
                expires_minutes=settings.reset_expires_minutes,
            )
        except Exception as exc:  # noqa: BLE001 — não derruba o fluxo se email falhar
            logger.warning("auth.reset_email_failed", error=str(exc))
    logger.info("auth.forgot_password", email=payload.email, matches=len(users))
    return {"ok": True}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest) -> dict[str, bool]:
    token_hash = auth_svc.hash_reset_token(payload.token)
    reset_id = await reset_repo.get_valid_reset(token_hash)
    user_id = await reset_repo.get_user_id_for_reset(token_hash)
    if reset_id is None or user_id is None:
        raise HTTPException(status_code=400, detail="link inválido ou expirado")

    new_hash = auth_svc.hash_password(payload.password)
    await admin_repo.set_password(user_id, new_hash)
    await reset_repo.mark_used(reset_id)
    await reset_repo.invalidate_user_resets(user_id)
    logger.info("auth.reset_password", user_id=str(user_id))
    return {"ok": True}
