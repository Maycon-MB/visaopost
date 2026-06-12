"""Testa stock_photos: pool load, tag filtering, determinismo, data URI."""

from __future__ import annotations

from datetime import date as DateType

from app.services import stock_photos as sp


def _clear_cache() -> None:
    sp._load_pool.cache_clear()


def test_load_pool_lista_jpegs_existentes() -> None:
    _clear_cache()
    pool = sp._load_pool()
    assert len(pool) > 0
    assert all(p.suffix == ".jpg" for p in pool)
    assert all(p.is_file() for p in pool)


def test_pick_for_theme_retorna_data_uri_valido() -> None:
    _clear_cache()
    uri = sp.pick_for_theme(target_date=DateType(2026, 6, 1), theme="generic")
    assert uri is not None
    assert uri.startswith("data:image/jpeg;base64,")
    assert len(uri) > 1000  # JPEG real, não payload vazio


def test_pick_for_theme_deterministico() -> None:
    _clear_cache()
    target = DateType(2026, 6, 10)
    uri1 = sp.pick_for_theme(target_date=target, theme="verao")
    uri2 = sp.pick_for_theme(target_date=target, theme="verao")
    assert uri1 == uri2


def test_pick_for_theme_tag_match_filtra_pool() -> None:
    """Quando há tag overlap, escolhe entre candidatos filtrados, não pool inteiro."""
    import base64

    _clear_cache()
    # "lifestyle" combina só com dilorenzo_stories_01.jpg — pool candidato tem 1 elemento.
    uri_match = sp.pick_for_theme(target_date=DateType(2026, 6, 15), theme="lifestyle")
    # Tema sem nenhuma tag combinando — cai no pool inteiro.
    uri_no_match = sp.pick_for_theme(target_date=DateType(2026, 6, 15), theme="xpto_inexistente")
    assert uri_match is not None
    assert uri_no_match is not None
    # "lifestyle" tem pool de 1 → sempre retorna dilorenzo_stories_01.jpg
    stories_path = sp.STOCK_DIR / "dilorenzo_stories_01.jpg"
    expected = base64.b64encode(stories_path.read_bytes()).decode("ascii")
    assert expected in uri_match


def test_pick_for_theme_pool_vazio_retorna_none(monkeypatch: object, tmp_path: object) -> None:
    """Sem arquivos no STOCK_DIR, retorna None em vez de explodir."""
    from pathlib import Path

    empty_dir = Path(tmp_path) / "vazio"  # type: ignore[arg-type]
    empty_dir.mkdir()
    monkeypatch.setattr(sp, "STOCK_DIR", empty_dir)  # type: ignore[attr-defined]
    _clear_cache()
    uri = sp.pick_for_theme(target_date=DateType(2026, 6, 1), theme="qualquer")
    assert uri is None


def test_pick_for_theme_rotaciona_por_data() -> None:
    """Datas consecutivas devem variar a foto escolhida no caso geral."""
    _clear_cache()
    picks = {
        sp.pick_for_theme(target_date=DateType(2026, 6, d), theme="generic") for d in range(1, 15)
    }
    # Pelo menos 2 fotos distintas em 14 dias com tema neutro.
    assert len(picks) >= 2
