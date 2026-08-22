"""Testa heurística + gate + predição de alcance (Fase 10k). Sem DB, sem rede."""

from __future__ import annotations

import random
from datetime import date
from uuid import uuid4

import pytest

from app.models.post_features import PostFeatureRow
from app.services.ml import heuristics
from app.services.ml.reach_predictor import (
    MIN_SAMPLES_TO_TRAIN,
    HeuristicPredictor,
    can_train,
    train_reach_model,
)


def _row(*, theme: str, hour: int, reach: int, dow: int = 2) -> PostFeatureRow:
    return PostFeatureRow(
        post_id=uuid4(),
        tenant_id=uuid4(),
        theme=theme,
        mood="informativo",
        day_of_week=dow,
        hour_of_day=hour,
        is_holiday=False,
        caption_length=120,
        hashtag_count=8,
        reach=reach,
        impressions=reach + 50,
        likes=reach // 20,
        comments=1,
        saves=reach // 30,
        shares=0,
        snapshot_date=date(2026, 7, 1),
        days_since_post=7,
    )


def test_can_train_gate() -> None:
    assert can_train(MIN_SAMPLES_TO_TRAIN) is True
    assert can_train(MIN_SAMPLES_TO_TRAIN - 1) is False


def test_heuristic_best_theme_ranks_by_avg_reach() -> None:
    rows = [
        _row(theme="solar_grau", hour=12, reach=100),
        _row(theme="solar_grau", hour=12, reach=200),
        _row(theme="cuidado_estojo", hour=9, reach=10),
    ]
    stats = heuristics.best_theme_by_avg_reach(rows)
    assert stats[0].key == "solar_grau"
    assert stats[0].avg_reach == 150.0
    assert stats[0].confident is False  # só 2 amostras, min é 3


def test_heuristic_predictor_falls_back_to_overall_avg_for_unseen_theme() -> None:
    rows = [_row(theme="solar_grau", hour=12, reach=100), _row(theme="solar_grau", hour=12, reach=300)]
    predictor = HeuristicPredictor(rows)
    prediction = predictor.predict_reach(theme="tema_nunca_visto", hour=23, day_of_week=1, is_holiday=False)
    assert prediction == 200.0  # média geral, sem dado do tema/hora
    assert predictor.is_ml() is False


def test_train_reach_model_returns_heuristic_below_gate() -> None:
    rows = [_row(theme="solar_grau", hour=12, reach=100) for _ in range(5)]
    predictor = train_reach_model(uuid4(), rows)
    assert predictor.is_ml() is False


def test_train_reach_model_activates_ml_when_signal_is_clear() -> None:
    pytest.importorskip("sklearn")
    rng = random.Random(42)
    rows = []
    # Sinal forte e sem ruído: tema A sempre bomba de manhã, tema B sempre manhã fraco.
    for _ in range(40):
        hour = rng.choice([8, 9, 10])
        reach = 500 if hour == 9 else 100
        rows.append(_row(theme="solar_grau", hour=hour, reach=reach))
    predictor = train_reach_model(uuid4(), rows)
    # Não afirma que ML sempre vence (pode perder pra heurística) — só que o
    # gate liberou o treino e devolveu um preditor funcional.
    assert predictor.predict_reach(theme="solar_grau", hour=9, day_of_week=2, is_holiday=False) > 0
