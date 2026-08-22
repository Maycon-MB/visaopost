"""Persistência local do modelo treinado (Fase 10k.5).

Disco local (backend/app/ml_models/{tenant_id}/) é suficiente pro volume do
projeto — artefato de poucas dezenas de KB, cabe no backup B2 já existente
(Fase 8) sem precisar de model registry dedicado.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from uuid import UUID

import joblib

_MODELS_DIR = Path(__file__).resolve().parents[2] / "ml_models"


def _tenant_dir(tenant_id: UUID) -> Path:
    return _MODELS_DIR / str(tenant_id)


def save_model(tenant_id: UUID, *, vectorizer: Any, model: Any, metadata: dict[str, Any]) -> None:
    tenant_dir = _tenant_dir(tenant_id)
    tenant_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump({"vectorizer": vectorizer, "model": model}, tenant_dir / "reach_model.joblib")
    (tenant_dir / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")


def load_model(tenant_id: UUID) -> tuple[Any, Any] | None:
    path = _tenant_dir(tenant_id) / "reach_model.joblib"
    if not path.exists():
        return None
    payload = joblib.load(path)
    return payload["vectorizer"], payload["model"]
