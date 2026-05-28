"""Testa validators dos modelos Pydantic Fase 6 (Client/Settings/Approval).

Sem DB, sem rede. Foca nas regras de negócio que entrampam input vindo da PWA
ou do CSV (telefone BR, email simples, dias da semana, feedback obrigatório no
regenerate).
"""

from __future__ import annotations

from datetime import date as DateType
from datetime import timedelta

import pytest
from pydantic import ValidationError

from app.models.approval import ApprovalAction
from app.models.client import ClientCreate, ClientUpdate
from app.models.settings import TenantSettings, TenantSettingsUpdate

# ----------------- ClientCreate -----------------


def test_client_create_normaliza_telefone_separadores() -> None:
    payload = ClientCreate(name="Maria Silva", phone="(11) 9 8765-4321")
    assert payload.phone == "11987654321"


def test_client_create_rejeita_telefone_curto() -> None:
    with pytest.raises(ValidationError, match="at least 10|dígitos"):
        ClientCreate(name="Xy", phone="1234")


def test_client_create_email_lowercase_trim() -> None:
    payload = ClientCreate(name="Joao", phone="11987654321", email="  Joao@EMAIL.com ")
    assert payload.email == "joao@email.com"


def test_client_create_email_invalido() -> None:
    with pytest.raises(ValidationError, match="email inválido"):
        ClientCreate(name="Joao", phone="11987654321", email="lixo_sem_arroba")


def test_client_create_exame_futuro_rejeitado() -> None:
    with pytest.raises(ValidationError, match="futuro"):
        ClientCreate(
            name="A",
            phone="11987654321",
            last_exam_date=DateType.today() + timedelta(days=1),
        )


def test_client_create_email_vazio_vira_none() -> None:
    payload = ClientCreate(name="Ana", phone="11987654321", email="   ")
    assert payload.email is None


# ----------------- ClientUpdate -----------------


def test_client_update_status_valido() -> None:
    patch = ClientUpdate(status="opted_out")
    assert patch.status == "opted_out"


def test_client_update_status_invalido() -> None:
    with pytest.raises(ValidationError, match="status inválido"):
        ClientUpdate(status="lixo")


def test_client_update_todos_none_eh_valido() -> None:
    """Patch vazio é legítimo — repo trata como no-op."""
    patch = ClientUpdate()
    assert patch.phone is None
    assert patch.status is None


# ----------------- TenantSettings -----------------


def test_tenant_settings_weekdays_ordena_e_dedup() -> None:
    settings = TenantSettings(
        send_hour=6,
        publish_hour=12,
        active_weekdays=[3, 1, 2, 2, 5],
    )
    assert settings.active_weekdays == [1, 2, 3, 5]


def test_tenant_settings_weekdays_fora_do_range() -> None:
    with pytest.raises(ValidationError, match="1.*7"):
        TenantSettings(
            send_hour=6,
            publish_hour=12,
            active_weekdays=[0, 1, 2],
        )


def test_tenant_settings_weekdays_vazio_rejeitado() -> None:
    with pytest.raises(ValidationError, match="pelo menos 1 dia"):
        TenantSettings(send_hour=6, publish_hour=12, active_weekdays=[])


def test_tenant_settings_update_email_normalizado() -> None:
    patch = TenantSettingsUpdate(owner_email="  Owner@Email.com ")
    assert patch.owner_email == "owner@email.com"


def test_tenant_settings_update_email_invalido() -> None:
    with pytest.raises(ValidationError, match="email inválido"):
        TenantSettingsUpdate(owner_email="naoemail")


# ----------------- ApprovalAction -----------------


def test_approval_action_approve_sem_feedback() -> None:
    action = ApprovalAction(action="approve")
    assert action.action == "approve"
    assert action.feedback is None


def test_approval_action_feedback_string_vazia_vira_none() -> None:
    action = ApprovalAction(action="reject", feedback="   ")
    assert action.feedback is None


def test_approval_action_feedback_preservado() -> None:
    action = ApprovalAction(action="regenerate", feedback="Faz mais alegre, menos serio.")
    assert action.feedback == "Faz mais alegre, menos serio."


def test_approval_action_acao_invalida() -> None:
    with pytest.raises(ValidationError, match="action"):
        ApprovalAction(action="explode")  # type: ignore[arg-type]
