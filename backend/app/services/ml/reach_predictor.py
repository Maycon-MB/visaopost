"""Preditor de alcance (Fase 10k.5).

scikit-learn isolado aqui — nunca importado fora de app/services/ml/. Liga
sozinho quando o dado real passar do gate `can_train`; até lá, `HeuristicPredictor`
cobre a mesma interface (`ReachPredictor`) e o resto do sistema nem sabe a
diferença.
"""

from __future__ import annotations

from typing import Any, Protocol
from uuid import UUID

from app.logging import get_logger
from app.models.post_features import PostFeatureRow
from app.services.ml import heuristics
from app.services.ml.model_store import load_model, save_model

logger = get_logger(__name__)

# Abaixo disso, o modelo tem mais graus de liberdade que exemplo — overfita
# e mente confiança que não tem. Heurística de média é mais honesta até aqui.
MIN_SAMPLES_TO_TRAIN = 30


def can_train(n_samples: int) -> bool:
    return n_samples >= MIN_SAMPLES_TO_TRAIN


class ReachPredictor(Protocol):
    def predict_reach(self, *, theme: str, hour: int, day_of_week: int, is_holiday: bool) -> float: ...
    def is_ml(self) -> bool: ...


class HeuristicPredictor:
    """Fallback sempre disponível: média por tema + média por hora, combinadas."""

    def __init__(self, rows: list[PostFeatureRow]) -> None:
        self._theme_stats = {s.key: s.avg_reach for s in heuristics.best_theme_by_avg_reach(rows)}
        self._hour_stats = {s.key: s.avg_reach for s in heuristics.best_hour_by_avg_reach(rows)}
        self._overall_avg = (sum(r.reach for r in rows) / len(rows)) if rows else 0.0

    def predict_reach(self, *, theme: str, hour: int, day_of_week: int, is_holiday: bool) -> float:
        theme_avg = self._theme_stats.get(theme, self._overall_avg)
        hour_avg = self._hour_stats.get(str(hour), self._overall_avg)
        return round((theme_avg + hour_avg) / 2, 1)

    def is_ml(self) -> bool:
        return False


def _rows_to_records(rows: list[PostFeatureRow]) -> tuple[list[dict[str, Any]], list[float]]:
    records = [
        {
            "theme": r.theme or "sem_tema",
            "hour_of_day": r.hour_of_day,
            "day_of_week": r.day_of_week,
            "is_holiday": int(r.is_holiday),
            "caption_length": r.caption_length,
            "hashtag_count": r.hashtag_count,
        }
        for r in rows
    ]
    targets = [float(r.reach) for r in rows]
    return records, targets


class MLPredictor:
    """Ridge sobre features one-hot. Só existe quando `train_reach_model` já
    confirmou que supera a heurística em holdout — nunca ativado às cegas."""

    def __init__(self, vectorizer: Any, model: Any) -> None:
        self._vectorizer = vectorizer
        self._model = model

    def predict_reach(self, *, theme: str, hour: int, day_of_week: int, is_holiday: bool) -> float:
        record = {
            "theme": theme,
            "hour_of_day": hour,
            "day_of_week": day_of_week,
            "is_holiday": int(is_holiday),
            "caption_length": 0,
            "hashtag_count": 0,
        }
        encoded = self._vectorizer.transform([record])
        return round(float(self._model.predict(encoded)[0]), 1)

    def is_ml(self) -> bool:
        return True


def train_reach_model(tenant_id: UUID, rows: list[PostFeatureRow]) -> ReachPredictor:
    """Treina Ridge só se houver dado suficiente E ele superar a heurística em
    holdout (CV 5-fold). Sempre devolve um `ReachPredictor` utilizável — nunca
    falha "pra cima" mandando erro pro chamador."""
    heuristic = HeuristicPredictor(rows)

    if not can_train(len(rows)):
        logger.info("ml.reach_predictor.gate_not_met", tenant_id=str(tenant_id), n_samples=len(rows))
        return heuristic

    from sklearn.feature_extraction import DictVectorizer
    from sklearn.linear_model import Ridge
    from sklearn.model_selection import KFold, cross_val_score

    records, targets = _rows_to_records(rows)
    vectorizer = DictVectorizer(sparse=False)
    encoded = vectorizer.fit_transform(records)

    model = Ridge(alpha=1.0)
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    ml_mae = -cross_val_score(model, encoded, targets, cv=cv, scoring="neg_mean_absolute_error").mean()

    heuristic_preds = [
        heuristic.predict_reach(
            theme=r.theme or "sem_tema",
            hour=r.hour_of_day,
            day_of_week=r.day_of_week,
            is_holiday=r.is_holiday,
        )
        for r in rows
    ]
    heuristic_mae = sum(abs(p - t) for p, t in zip(heuristic_preds, targets, strict=True)) / len(targets)

    logger.info(
        "ml.reach_predictor.evaluated",
        tenant_id=str(tenant_id),
        n_samples=len(rows),
        ml_mae=round(float(ml_mae), 1),
        heuristic_mae=round(heuristic_mae, 1),
    )

    if ml_mae >= heuristic_mae:
        logger.info("ml.reach_predictor.heuristic_wins", tenant_id=str(tenant_id))
        return heuristic

    model.fit(encoded, targets)
    save_model(
        tenant_id,
        vectorizer=vectorizer,
        model=model,
        metadata={"n_samples": len(rows), "ml_mae": float(ml_mae), "heuristic_mae": heuristic_mae},
    )
    logger.info("ml.reach_predictor.ml_activated", tenant_id=str(tenant_id), n_samples=len(rows))
    return MLPredictor(vectorizer, model)


def get_predictor(tenant_id: UUID, rows: list[PostFeatureRow]) -> ReachPredictor:
    """Carrega modelo já treinado e persistido, se existir; senão heurística.
    Não treina aqui — treino é job batch separado (`train_reach_model`, cron mensal)."""
    if can_train(len(rows)):
        loaded = load_model(tenant_id)
        if loaded is not None:
            vectorizer, model = loaded
            return MLPredictor(vectorizer, model)
    return HeuristicPredictor(rows)
