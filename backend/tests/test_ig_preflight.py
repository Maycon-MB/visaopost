"""Pré-checagem da configuração antes de conectar o Instagram.

Existe pra que a configuração seja conferida ANTES da reunião presencial com o dono
da ótica, não descoberta na frente dele. Dois erros derrubam a conexão e nenhum dá
mensagem clara na Meta: URL de callback apontando pra localhost, e `api_base_url`
inacessível de fora (os servidores da Meta baixam a imagem de lá, não o navegador).
"""

from __future__ import annotations

from app.services.instagram_preflight import check_config, explain_ig_error


def _ok_config() -> dict[str, str]:
    return {
        "app_id": "891876360640132",
        "app_secret": "segredo",
        "redirect_uri": "https://visaopost.ngrok-free.app/auth/facebook/callback",
        "api_base_url": "https://visaopost.ngrok-free.app",
    }


def _keys_com_falha(checks: list) -> set[str]:
    return {c.key for c in checks if not c.ok}


def test_configuracao_completa_passa_em_tudo() -> None:
    checks = check_config(**_ok_config())
    assert _keys_com_falha(checks) == set()


def test_app_id_ausente_falha() -> None:
    cfg = _ok_config() | {"app_id": ""}
    assert "app_id" in _keys_com_falha(check_config(**cfg))


def test_app_secret_ausente_falha() -> None:
    cfg = _ok_config() | {"app_secret": ""}
    assert "app_secret" in _keys_com_falha(check_config(**cfg))


def test_callback_em_localhost_falha() -> None:
    """Meta redireciona o browser pra essa URL — localhost só existe na tua máquina."""
    cfg = _ok_config() | {"redirect_uri": "http://localhost:8000/auth/facebook/callback"}
    assert "redirect_uri_publica" in _keys_com_falha(check_config(**cfg))


def test_callback_sem_https_falha() -> None:
    cfg = _ok_config() | {"redirect_uri": "http://visaopost.ngrok-free.app/auth/facebook/callback"}
    assert "redirect_uri_publica" in _keys_com_falha(check_config(**cfg))


def test_api_base_url_em_localhost_falha() -> None:
    """Servidores da Meta baixam a imagem daqui. Localhost = publicação falha."""
    cfg = _ok_config() | {"api_base_url": "http://localhost:8000"}
    assert "api_base_url_publica" in _keys_com_falha(check_config(**cfg))


def test_callback_e_api_em_hosts_diferentes_avisa() -> None:
    """Erro comum: sobe túnel novo e atualiza só uma das duas variáveis."""
    cfg = _ok_config() | {"api_base_url": "https://outro-host.ngrok-free.app"}
    assert "mesmo_host" in _keys_com_falha(check_config(**cfg))


def test_callback_precisa_apontar_pro_endpoint_certo() -> None:
    cfg = _ok_config() | {"redirect_uri": "https://visaopost.ngrok-free.app/"}
    assert "redirect_uri_caminho" in _keys_com_falha(check_config(**cfg))


def test_cada_falha_traz_instrucao_de_correcao() -> None:
    cfg = _ok_config() | {"redirect_uri": "http://localhost:8000/auth/facebook/callback"}
    falha = next(c for c in check_config(**cfg) if not c.ok)
    assert falha.hint
    assert falha.label


def test_explica_bloqueio_de_politica_em_portugues() -> None:
    texto = explain_ig_error(368)
    assert "bloque" in texto.lower()


def test_explica_token_expirado() -> None:
    assert "reconect" in explain_ig_error(190).lower()


def test_explica_falta_de_cargo_no_app() -> None:
    """Causa mais comum de falha em app no modo desenvolvimento."""
    texto = explain_ig_error(200)
    assert "desenvolvedor" in texto.lower() or "testador" in texto.lower()


def test_codigo_desconhecido_nao_quebra() -> None:
    assert explain_ig_error(999999)
