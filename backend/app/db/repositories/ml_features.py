"""Leitura da view `post_features` pra treino/heurística de ML (Fase 10k)."""

from __future__ import annotations

from uuid import UUID

from app.db.pool import acquire
from app.models.post_features import PostFeatureRow

_MIN_DAYS_MATURE = 7


async def get_mature_features(tenant_id: UUID, *, min_days: int = _MIN_DAYS_MATURE) -> list[PostFeatureRow]:
    """Features de posts com métrica madura (snapshot capturado min_days+ após publicação).

    Métrica de reach ainda sobe nos primeiros dias — treinar em snapshot imaturo
    ensina o modelo a errar pra baixo sistematicamente.
    """
    async with acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT post_id, tenant_id, theme, mood, day_of_week, hour_of_day,
                   is_holiday, caption_length, hashtag_count,
                   reach, impressions, likes, comments, saves, shares,
                   snapshot_date, days_since_post
            FROM post_features
            WHERE tenant_id = $1
              AND days_since_post >= $2
            """,
            tenant_id,
            min_days,
        )
    return [PostFeatureRow(**dict(row)) for row in rows]
