"""Endpoints públicos do fluxo de aprovação do post.

Autenticação = JWT magic link no path (`/api/posts/{token}`). Sem cookie, sem
sessão, sem login. PWA consome esse endpoint quando o dono clica no email.

Path completo no PWA: `/aprovar/:token` → fetch `GET /api/posts/{token}` → render.
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.db.repositories.posts import (
    get_approval_view,
    mark_approved,
    mark_rejected,
    request_regenerate,
)
from app.logging import get_logger
from app.models.approval import ApprovalAction, PostApprovalView
from app.services.jwt import InvalidApprovalToken, verify_approval_token

router = APIRouter(prefix="/api/posts", tags=["posts"])
logger = get_logger(__name__)


def _resolve_post_id(token: str) -> UUID:
    """Verifica JWT + extrai post_id. Levanta 401 se inválido."""
    try:
        payload = verify_approval_token(token)
    except InvalidApprovalToken as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc
    try:
        return UUID(payload["post_id"])
    except (KeyError, ValueError) as exc:
        raise HTTPException(status_code=401, detail="payload do token inválido") from exc


@router.get("/{token}", response_model=PostApprovalView)
async def get_post_for_approval(token: str) -> PostApprovalView:
    """Snapshot do post pro PWA renderizar. 401 token inválido, 404 post sumido."""
    post_id = _resolve_post_id(token)
    view = await get_approval_view(post_id)
    if view is None:
        raise HTTPException(status_code=404, detail=f"post {post_id} não encontrado")
    return view


@router.post("/{token}/action")
async def act_on_post(token: str, body: ApprovalAction) -> dict[str, object]:
    """Approve / reject / regenerate. Body: `{action, feedback?}`.

    - approve: marca aprovado. Worker da Fase 10 publica no IG.
    - reject: marca rejeitado com motivo opcional. Não regera.
    - regenerate: marca draft + feedback + incrementa counter. Worker regera.
    """
    post_id = _resolve_post_id(token)
    view = await get_approval_view(post_id)
    if view is None:
        raise HTTPException(status_code=404, detail=f"post {post_id} não encontrado")

    if body.action == "approve":
        ok = await mark_approved(post_id)
    elif body.action == "reject":
        ok = await mark_rejected(post_id, reason=body.feedback)
    else:  # regenerate
        if not body.feedback:
            raise HTTPException(
                status_code=422,
                detail="ao pedir regerar, envie feedback dizendo o que mudar",
            )
        ok = await request_regenerate(post_id, feedback=body.feedback)

    if not ok:
        raise HTTPException(
            status_code=409,
            detail=f"post está em status {view.status!r}, ação {body.action!r} não aplicável",
        )

    logger.info(
        "post.action",
        post_id=str(post_id),
        action=body.action,
        feedback_chars=len(body.feedback or ""),
    )
    refreshed = await get_approval_view(post_id)
    assert refreshed is not None  # acabamos de mutar, existe
    return {"action": body.action, "post": refreshed.model_dump(mode="json")}
