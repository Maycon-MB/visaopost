"""Bot WhatsApp via Cloud API Meta.

Flow inbound:
  1. Meta → POST /webhook/whatsapp com payload de mensagem
  2. `process_webhook` resolve tenant pelo phone_number_id
  3. Gemini detecta intent contra whatsapp_faq do tenant
  4. Bot responde via Cloud API
  5. Conversa salva em `conversations` (auditoria)
  6. Intent desconhecido → escala pro humano via email

Flow recall (worker):
  `send_recall_batch(tenant_slug)` varre clientes com exame > 12 meses,
  dispara template Meta aprovado, salva conversa outbound.

Protocol `WhatsAppGateway` para DI em testes (sem tocar rede).
"""

from __future__ import annotations

import json
from typing import Any, Protocol
from uuid import UUID

import httpx

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)

_GRAPH_BASE = "https://graph.facebook.com/v21.0"
_RECALL_TEMPLATE = "visaopost_recall_1"
_RECALL_LANGUAGE = "pt_BR"


# ─── Protocol (DI / testes) ──────────────────────────────────────────────────

class WhatsAppGateway(Protocol):
    async def send_text(self, *, to: str, text: str) -> str: ...
    async def send_template(self, *, to: str, template: str, language: str, params: list[str]) -> str: ...


# ─── Cliente real ─────────────────────────────────────────────────────────────

class _MetaCloudClient:
    def __init__(self, *, phone_number_id: str, access_token: str) -> None:
        self._phone_id = phone_number_id
        self._token = access_token

    async def send_text(self, *, to: str, text: str) -> str:
        """Envia mensagem de texto livre. Retorna message_id."""
        payload: dict[str, Any] = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": text},
        }
        return await self._post(payload)

    async def send_template(
        self, *, to: str, template: str, language: str, params: list[str]
    ) -> str:
        """Envia template pré-aprovado Meta. Retorna message_id."""
        components: list[dict[str, Any]] = []
        if params:
            components = [
                {
                    "type": "body",
                    "parameters": [{"type": "text", "text": p} for p in params],
                }
            ]
        payload: dict[str, Any] = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "template",
            "template": {
                "name": template,
                "language": {"code": language},
                "components": components,
            },
        }
        return await self._post(payload)

    async def _post(self, payload: dict[str, Any]) -> str:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"{_GRAPH_BASE}/{self._phone_id}/messages",
                json=payload,
                headers={"Authorization": f"Bearer {self._token}"},
            )
            if resp.status_code >= 400:
                try:
                    err = resp.json().get("error", {}).get("message", resp.text)
                except Exception:
                    err = resp.text
                raise RuntimeError(f"WhatsApp API {resp.status_code}: {err}")
            data = resp.json()
            messages = data.get("messages", [{}])
            return str(messages[0].get("id", ""))


def get_whatsapp_client(
    *,
    phone_number_id: str | None = None,
    access_token: str | None = None,
) -> _MetaCloudClient:
    s = get_settings()
    return _MetaCloudClient(
        phone_number_id=phone_number_id or s.whatsapp_phone_id,
        access_token=access_token or s.whatsapp_access_token,
    )


# ─── Webhook parsing ─────────────────────────────────────────────────────────

class InboundMessage:
    __slots__ = ("phone_number_id", "from_phone", "text", "wa_message_id")

    def __init__(
        self,
        *,
        phone_number_id: str,
        from_phone: str,
        text: str,
        wa_message_id: str,
    ) -> None:
        self.phone_number_id = phone_number_id
        self.from_phone = from_phone
        self.text = text
        self.wa_message_id = wa_message_id


def parse_webhook_message(payload: dict[str, Any]) -> InboundMessage | None:
    """Extrai primeira mensagem de texto do payload Meta. None se não for msg de texto."""
    try:
        entry = payload["entry"][0]
        change = entry["changes"][0]["value"]
        phone_number_id = change["metadata"]["phone_number_id"]
        messages = change.get("messages", [])
        if not messages:
            return None
        msg = messages[0]
        if msg.get("type") != "text":
            return None
        return InboundMessage(
            phone_number_id=phone_number_id,
            from_phone=msg["from"],
            text=msg["text"]["body"],
            wa_message_id=msg["id"],
        )
    except (KeyError, IndexError, TypeError):
        return None


# ─── Intent detection via Gemini ─────────────────────────────────────────────

_INTENT_PROMPT = """Você é um classificador de intenção para bot de ótica.

FAQ da ótica:
{faq}

Mensagem do cliente: "{message}"

Classifique a intenção em UMA das categorias abaixo e responda em JSON puro.
Categorias: horario, localizacao, agendamento, preco, lente, armacao, garantia,
            pagamento, recall_confirm, saudacao, escalada, desconhecido

Se a mensagem pode ser respondida pelo FAQ, inclua a resposta no campo "reply".
Se precisar de atendimento humano, use "escalada" ou "desconhecido".

Responda APENAS com JSON:
{{"intent": "<categoria>", "reply": "<resposta curta em português informal>"}}"""


async def detect_intent(*, message: str, faq: str) -> tuple[str, str]:
    """Retorna (intent, reply). Fallback pra escalada se Gemini falhar."""
    import google.generativeai as genai
    from app.services._gemini_retry import call_with_backoff

    s = get_settings()
    if not s.gemini_api_key:
        return "desconhecido", ""

    try:
        genai.configure(api_key=s.gemini_api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        config = genai.types.GenerationConfig(
            temperature=0.3,
            max_output_tokens=512,
            response_mime_type="application/json",
        )
        prompt = _INTENT_PROMPT.format(faq=faq or "(sem FAQ configurado)", message=message)
        response = call_with_backoff(
            lambda: model.generate_content(prompt, generation_config=config)
        )
        data = json.loads(response.text or "{}")
        intent = str(data.get("intent", "desconhecido"))
        reply = str(data.get("reply", ""))
        return intent, reply
    except Exception as exc:
        logger.warning("whatsapp.intent_failed", error=str(exc))
        return "desconhecido", ""


# ─── Escalação ────────────────────────────────────────────────────────────────

async def escalate_to_human(
    *,
    tenant_id: UUID,
    from_phone: str,
    message: str,
    intent: str,
) -> None:
    """Envia email pro owner_email do tenant alertando sobre mensagem não respondida."""
    from app.db.repositories.tenants import get_tenant_settings
    from app.services.email import send_email

    settings = await get_tenant_settings(tenant_id)
    if not settings or not settings.owner_email:
        logger.warning("whatsapp.escalate_no_owner", tenant_id=str(tenant_id))
        return

    subject = f"WhatsApp: mensagem não respondida de {from_phone}"
    body = f"""<p>Uma mensagem chegou pelo WhatsApp e precisa de atenção:</p>
<p><strong>De:</strong> {from_phone}<br>
<strong>Intent detectado:</strong> {intent}<br>
<strong>Mensagem:</strong> {message}</p>
<p>Responda diretamente pelo seu WhatsApp.</p>"""

    await send_email(
        to=settings.owner_email,
        subject=subject,
        html_body=body,
    )
    logger.info("whatsapp.escalated", tenant_id=str(tenant_id), from_phone=from_phone)


# ─── Save conversation ────────────────────────────────────────────────────────

async def save_conversation(
    *,
    tenant_id: UUID,
    contact_phone: str,
    direction: str,
    message: str,
    intent: str | None,
    handled_by: str,
) -> None:
    from app.db.pool import acquire

    async with acquire() as conn:
        await conn.execute(
            """
            INSERT INTO conversations
                (tenant_id, contact_phone, direction, message, intent, handled_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            tenant_id,
            contact_phone,
            direction,
            message,
            intent,
            handled_by,
        )


# ─── Main webhook processor ───────────────────────────────────────────────────

async def process_webhook(
    payload: dict[str, Any],
    *,
    gateway: WhatsAppGateway | None = None,
) -> None:
    """Processa payload inbound do webhook Meta.

    Resolve tenant pelo phone_number_id, detecta intent via Gemini,
    responde via Cloud API, salva conversa.
    """
    msg = parse_webhook_message(payload)
    if not msg:
        return

    tenant_id, faq = await _resolve_tenant(msg.phone_number_id)
    if not tenant_id:
        logger.warning("whatsapp.unknown_phone_id", phone_number_id=msg.phone_number_id)
        return

    intent, reply = await detect_intent(message=msg.text, faq=faq or "")

    needs_escalation = intent in ("escalada", "desconhecido") or not reply.strip()
    handled_by = "bot" if not needs_escalation else "unanswered"

    client = gateway or get_whatsapp_client()

    if not needs_escalation and reply.strip():
        await client.send_text(to=msg.from_phone, text=reply)
        await save_conversation(
            tenant_id=tenant_id,
            contact_phone=msg.from_phone,
            direction="inbound",
            message=msg.text,
            intent=intent,
            handled_by="bot",
        )
        await save_conversation(
            tenant_id=tenant_id,
            contact_phone=msg.from_phone,
            direction="outbound",
            message=reply,
            intent=intent,
            handled_by="bot",
        )
    else:
        fallback = "Oi! Já anotei sua mensagem e vou te responder em breve 😊"
        await client.send_text(to=msg.from_phone, text=fallback)
        await save_conversation(
            tenant_id=tenant_id,
            contact_phone=msg.from_phone,
            direction="inbound",
            message=msg.text,
            intent=intent,
            handled_by="unanswered",
        )
        await escalate_to_human(
            tenant_id=tenant_id,
            from_phone=msg.from_phone,
            message=msg.text,
            intent=intent,
        )

    logger.info(
        "whatsapp.processed",
        from_phone=msg.from_phone,
        intent=intent,
        handled_by=handled_by,
    )


async def _resolve_tenant(phone_number_id: str) -> tuple[UUID | None, str | None]:
    """Busca tenant pelo whatsapp_phone_id. Retorna (tenant_id, whatsapp_faq)."""
    from app.db.pool import acquire

    async with acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, whatsapp_faq FROM tenants WHERE whatsapp_phone_id = $1 AND is_active = true",
            phone_number_id,
        )
    if not row:
        return None, None
    return row["id"], row["whatsapp_faq"]


# ─── Recall batch ─────────────────────────────────────────────────────────────

async def send_recall_batch(tenant_slug: str, *, gateway: WhatsAppGateway | None = None) -> dict[str, Any]:
    """Envia recall WhatsApp pra clientes com exame > 12 meses.

    Retorna summary: total_eligible, sent, skipped, errors.
    Template `visaopost_recall_1` precisa estar aprovado na Meta.
    """
    from app.db.pool import acquire
    from app.db.repositories.tenants import get_tenant_id_by_slug, get_tenant_settings

    tenant_id = await get_tenant_id_by_slug(tenant_slug)
    if not tenant_id:
        return {"status": "tenant_not_found"}

    settings = await get_tenant_settings(tenant_id)
    if not settings:
        return {"status": "settings_not_found"}

    async with acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, name, phone
            FROM clients
            WHERE tenant_id = $1
              AND status = 'active'
              AND consent_whatsapp = true
              AND last_exam_date < now() - interval '12 months'
              AND (last_contacted_at IS NULL OR last_contacted_at < now() - interval '30 days')
            ORDER BY last_exam_date ASC
            LIMIT 50
            """,
            tenant_id,
        )

    if not rows:
        return {"status": "ok", "total_eligible": 0, "sent": 0, "skipped": 0, "errors": 0}

    client = gateway or get_whatsapp_client()
    sent = skipped = errors = 0

    for row in rows:
        phone: str = row["phone"]
        name: str = row["name"]

        if not phone or not phone.strip():
            skipped += 1
            continue

        # Normaliza número pra formato internacional sem +
        normalized = phone.strip().lstrip("+").replace(" ", "").replace("-", "")
        if not normalized.startswith("55"):
            normalized = "55" + normalized

        try:
            await client.send_template(
                to=normalized,
                template=_RECALL_TEMPLATE,
                language=_RECALL_LANGUAGE,
                params=[name.split()[0]],  # primeiro nome
            )
            await save_conversation(
                tenant_id=tenant_id,
                contact_phone=normalized,
                direction="outbound",
                message=f"[recall template: {_RECALL_TEMPLATE}]",
                intent="recall",
                handled_by="bot",
            )
            # Marca contato
            async with acquire() as conn:
                await conn.execute(
                    "UPDATE clients SET last_contacted_at = now() WHERE id = $1",
                    row["id"],
                )
            sent += 1
            logger.info("recall.sent", client_id=str(row["id"]), phone=normalized)
        except Exception as exc:
            errors += 1
            logger.error("recall.failed", client_id=str(row["id"]), error=str(exc))

    return {
        "status": "ok",
        "tenant": tenant_slug,
        "total_eligible": len(rows),
        "sent": sent,
        "skipped": skipped,
        "errors": errors,
    }
