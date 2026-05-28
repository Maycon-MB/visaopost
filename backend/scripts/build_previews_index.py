"""Regenera previews/index.html — galeria estática lista todos os dias gerados.

Lê previews/*/metadata.json, monta página HTML simples (sem framework).
Rodado pelo workflow daily-post.yml depois de gerar o post do dia.

Fase 7 substitui isto pela landing Astro real. Hoje é só prova-de-vida visual
pro cliente abrir no celular durante demo.
"""

from __future__ import annotations

import html
import json
from datetime import UTC, datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PREVIEWS_DIR = REPO_ROOT / "previews"


def _load_entries(previews_dir: Path) -> list[dict[str, object]]:
    entries: list[dict[str, object]] = []
    if not previews_dir.is_dir():
        return entries
    for day_dir in sorted(previews_dir.iterdir(), reverse=True):
        if not day_dir.is_dir():
            continue
        meta_path = day_dir / "metadata.json"
        img_path = day_dir / "post.jpg"
        if not (meta_path.is_file() and img_path.is_file()):
            continue
        try:
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        entries.append(
            {
                "date": str(meta.get("date") or day_dir.name),
                "theme": str(meta.get("theme") or "—"),
                "mood": str(meta.get("mood") or ""),
                "holiday_name": str(meta.get("holiday_name") or ""),
                "caption": str(meta.get("caption") or ""),
                "cta": str(meta.get("cta") or ""),
                "image_rel": f"{day_dir.name}/post.jpg",
            }
        )
    return entries


def _render_card(entry: dict[str, object]) -> str:
    date = html.escape(str(entry["date"]))
    theme = html.escape(str(entry["theme"]))
    mood = html.escape(str(entry["mood"]))
    holiday = html.escape(str(entry["holiday_name"]))
    caption = html.escape(str(entry["caption"]))
    cta = html.escape(str(entry["cta"]))
    img = html.escape(str(entry["image_rel"]))
    badges = "".join(
        f'<span class="badge">{b}</span>' for b in [theme, mood, holiday] if b and b != "—"
    )
    return f"""
    <article class="card">
      <img src="{img}" alt="Post {date}" loading="lazy" />
      <div class="meta">
        <h2>{date}</h2>
        <div class="badges">{badges}</div>
        <p class="caption">{caption}</p>
        <p class="cta">→ {cta}</p>
      </div>
    </article>
    """


def render_index(entries: list[dict[str, object]]) -> str:
    cards = "\n".join(_render_card(e) for e in entries)
    updated = datetime.now(UTC).strftime("%Y-%m-%d %H:%M UTC")
    count = len(entries)
    body_empty = (
        '<p class="empty">Nenhum preview ainda. O cron diário irá gerar o primeiro post.</p>'
    )
    body = cards if entries else body_empty
    return f"""<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>VisaoPost — Galeria de previews</title>
<style>
  :root {{
    --bg: #0e0e10;
    --card: #17171b;
    --fg: #f4f4f5;
    --muted: #a1a1aa;
    --accent: #f59e0b;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    background: var(--bg);
    color: var(--fg);
    line-height: 1.5;
  }}
  header {{
    padding: 32px 20px 16px;
    text-align: center;
    border-bottom: 1px solid #27272a;
  }}
  header h1 {{ margin: 0 0 4px; font-size: 28px; }}
  header p {{ margin: 0; color: var(--muted); font-size: 14px; }}
  main {{
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px 16px 64px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }}
  .card {{
    background: var(--card);
    border: 1px solid #27272a;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }}
  .card img {{ width: 100%; height: auto; display: block; aspect-ratio: 1/1; object-fit: cover; }}
  .meta {{ padding: 14px 16px 18px; }}
  .meta h2 {{ margin: 0 0 8px; font-size: 18px; }}
  .badges {{ display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }}
  .badge {{
    background: #27272a;
    color: var(--muted);
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }}
  .caption {{
    margin: 8px 0;
    font-size: 14px;
    color: #d4d4d8;
    white-space: pre-wrap;
    max-height: 9em;
    overflow: hidden;
  }}
  .cta {{ margin: 6px 0 0; color: var(--accent); font-size: 13px; font-weight: 600; }}
  .empty {{
    grid-column: 1 / -1;
    text-align: center;
    color: var(--muted);
    padding: 64px 16px;
  }}
  footer {{
    text-align: center;
    color: var(--muted);
    font-size: 12px;
    padding: 16px;
    border-top: 1px solid #27272a;
  }}
</style>
</head>
<body>
<header>
  <h1>VisaoPost — Galeria de previews</h1>
  <p>{count} post(s) gerado(s). Atualizado em {updated}.</p>
</header>
<main>
{body}
</main>
<footer>Cron diário GH Actions. Demo pré-produção — não publicado no Instagram.</footer>
</body>
</html>
"""


def main() -> int:
    entries = _load_entries(PREVIEWS_DIR)
    PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)
    out = PREVIEWS_DIR / "index.html"
    out.write_text(render_index(entries), encoding="utf-8")
    print(f"[OK] {len(entries)} preview(s) -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
