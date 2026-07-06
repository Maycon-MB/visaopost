-- 0013_post_features.sql
-- View de features pra ML de alcance (Fase 10k). Não materializada:
-- dado pequeno por tenant, recalcular é barato, evita job de REFRESH.
-- Idempotente via CREATE OR REPLACE VIEW.

BEGIN;

CREATE OR REPLACE VIEW post_features AS
SELECT
    p.id                                    AS post_id,
    p.tenant_id                             AS tenant_id,
    p.theme                                 AS theme,
    p.mood                                  AS mood,
    EXTRACT(DOW  FROM p.scheduled_at)::int  AS day_of_week,
    EXTRACT(HOUR FROM p.scheduled_at)::int  AS hour_of_day,
    (h.date IS NOT NULL)                    AS is_holiday,
    length(p.caption)                       AS caption_length,
    COALESCE(array_length(p.hashtags, 1), 0) AS hashtag_count,
    m.reach                                 AS reach,
    m.impressions                           AS impressions,
    m.likes                                 AS likes,
    m.comments                              AS comments,
    m.saves                                 AS saves,
    m.shares                                AS shares,
    m.snapshot_date                         AS snapshot_date,
    (m.snapshot_date - p.posted_at::date)   AS days_since_post
FROM posts p
JOIN LATERAL (
    SELECT * FROM metrics_instagram mi
    WHERE mi.post_id = p.id
    ORDER BY mi.snapshot_date DESC
    LIMIT 1
) m ON true
LEFT JOIN holidays_br h ON h.date = p.scheduled_at::date
WHERE p.status = 'posted';

COMMIT;
