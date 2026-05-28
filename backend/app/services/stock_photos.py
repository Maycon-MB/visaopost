"""Pool de fotos stock pro DEMO enquanto cliente não entrega fotos reais.

Fase 9 substitui isto por leitura da tabela `assets` (type='product', filtrado
por tags do tema). Mesma slot `theme.product_image_data_uri` — só muda a fonte
de bytes. Zero refactor no `template_generator`.

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
    "rayban_sunglasses_beach.jpg": ("verao", "sol", "esportivo", "lifestyle"),
    "oculos_luxo_close.jpg": ("luxo", "detalhe", "elegante", "premium"),
    "stylish_person_glasses.jpg": ("retrato", "estilo", "moda", "lifestyle"),
    "hero_otica_premium.jpg": ("ambiente", "premium", "marca"),
    "optical_shop_display.jpg": ("ambiente", "vitrine", "coleção"),
    "premium_optical_storefront.jpg": ("ambiente", "fachada", "marca"),
    "eye_exam_equipment.jpg": ("exame", "saude", "consulta", "tecnologia"),
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
