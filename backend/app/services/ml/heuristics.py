"""Heurística estatística de alcance (Fase 10k.4).

Fallback honesto enquanto não há dado suficiente pra treinar modelo real
(ver `reach_predictor.can_train`). Só agrupa e tira média — zero scikit-learn.
"""

from __future__ import annotations

from collections import defaultdict
from statistics import mean
from typing import Callable

from pydantic import BaseModel

from app.models.post_features import PostFeatureRow

MIN_SAMPLES_CONFIDENT = 3


class GroupStat(BaseModel):
    key: str
    avg_reach: float
    n_samples: int
    confident: bool


def _group_avg(rows: list[PostFeatureRow], key_fn: Callable[[PostFeatureRow], object]) -> list[GroupStat]:
    groups: dict[str, list[int]] = defaultdict(list)
    for row in rows:
        groups[str(key_fn(row))].append(row.reach)

    stats = [
        GroupStat(
            key=key,
            avg_reach=round(mean(values), 1),
            n_samples=len(values),
            confident=len(values) >= MIN_SAMPLES_CONFIDENT,
        )
        for key, values in groups.items()
    ]
    return sorted(stats, key=lambda s: s.avg_reach, reverse=True)


def best_theme_by_avg_reach(rows: list[PostFeatureRow]) -> list[GroupStat]:
    return _group_avg(rows, lambda r: r.theme or "sem_tema")


def best_hour_by_avg_reach(rows: list[PostFeatureRow]) -> list[GroupStat]:
    return _group_avg(rows, lambda r: r.hour_of_day)
