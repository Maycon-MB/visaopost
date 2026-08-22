"""Pool de fotos reais da Ótica Di Lorenzo para geração de posts.

Fase 9 substitui isto por leitura da tabela `assets` (type='product', filtrado
por tags do tema) quando cliente entregar fotos de produtos individuais.
Mesma slot `theme.product_image_data_uri` — só muda a fonte de bytes.

Rotação determinística por `date.toordinal() % N` evita repetição em janela
curta. Tags: cada foto carrega lista de moods/temas combinando — quando
disponível, filtra antes do round-robin. Sem tag match, cai no pool inteiro.
"""

from __future__ import annotations

import base64
from datetime import date as DateType
from functools import lru_cache
from pathlib import Path

from app.logging import get_logger

logger = get_logger(__name__)

STOCK_DIR = Path(__file__).resolve().parents[1] / "assets" / "stock_photos"

# Tags por filename — controlam afinidade tema/foto. Sem tag match em
# `pick_for_theme`, cai no pool inteiro. Lista é placeholder do mapping
# real que vai morar em `assets.tags` (Fase 9).
_TAGS: dict[str, tuple[str, ...]] = {
    "dilorenzo_vitrine_01.jpg": ("ambiente", "vitrine", "colecao", "marca", "loja"),
    "dilorenzo_vitrine_02.jpg": ("ambiente", "vitrine", "premium", "elegante", "loja"),
    "dilorenzo_vitrine_03.jpg": ("ambiente", "vitrine", "luxo", "colecao", "loja"),
    "dilorenzo_stories_01.jpg": ("lifestyle", "marca", "estilo", "moda"),
    "dilorenzo_moodboard_01.jpg": ("premium", "elegante", "luxo", "marca", "estilo"),
}


@lru_cache(maxsize=1)
def _load_pool() -> tuple[Path, ...]:
    """Lista JPEGs em STOCK_DIR, ordenada pra rotação ser estável entre runs."""
    if not STOCK_DIR.is_dir():
        logger.warning("stock_photos.dir_missing", path=str(STOCK_DIR))
        return ()
    photos = tuple(sorted(p for p in STOCK_DIR.iterdir() if p.suffix.lower() == ".jpg"))
    if not photos:
        logger.warning("stock_photos.empty", path=str(STOCK_DIR))
    return photos


def _encode_data_uri(path: Path) -> str:
    """Lê arquivo e devolve `data:image/jpeg;base64,...` pronto pra `<img src>`."""
    payload = path.read_bytes()
    b64 = base64.b64encode(payload).decode("ascii")
    return f"data:image/jpeg;base64,{b64}"


def pick_for_theme(
    *,
    target_date: DateType,
    theme: str,
    mood: str | None = None,
) -> str | None:
    """Seleciona uma foto stock e retorna data URI. None se pool vazio.

    Estratégia:
        1. Filtra pool por overlap entre `(theme, mood)` e tags do filename.
        2. Sem match, usa pool inteiro.
        3. Rotação `date.toordinal() % len(candidatas)`.

    Determinística: mesma `target_date` + mesmo tema = mesma foto. Sem rede,
    sem RNG. Teste vira fácil de escrever.
    """
    pool = _load_pool()
    if not pool:
        return None

    wanted = {t for t in (theme, mood) if t}
    matches = [p for p in pool if wanted & set(_TAGS.get(p.name, ()))]
    candidates = tuple(matches) if matches else pool

    idx = target_date.toordinal() % len(candidates)
    chosen = candidates[idx]
    logger.info(
        "stock_photos.picked",
        date=target_date.isoformat(),
        theme=theme,
        mood=mood,
        chosen=chosen.name,
        pool_size=len(candidates),
        matched_by_tag=bool(matches),
    )
    return _encode_data_uri(chosen)
