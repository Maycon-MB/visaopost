"""JWT_SECRET e obrigatorio: sem ele a app nao sobe."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.config import Settings


def test_jwt_secret_ausente_impede_boot(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("JWT_SECRET", raising=False)
    with pytest.raises(ValidationError, match="jwt_secret"):
        Settings(_env_file=None)


@pytest.mark.parametrize("valor", ["", "change-me", "change-me-to-random-64-chars"])
def test_jwt_secret_vazio_ou_placeholder_impede_boot(
    monkeypatch: pytest.MonkeyPatch, valor: str
) -> None:
    monkeypatch.setenv("JWT_SECRET", valor)
    with pytest.raises(ValidationError, match="jwt_secret"):
        Settings(_env_file=None)


def test_jwt_secret_configurado_e_aceito(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("JWT_SECRET", "s3gredo-real-gerado-aleatoriamente")
    assert Settings(_env_file=None).jwt_secret == "s3gredo-real-gerado-aleatoriamente"
