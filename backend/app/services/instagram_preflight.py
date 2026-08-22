"""Pré-checagem da configuração de conexão com o Instagram.

Serve pra conferir, antes da reunião com o dono da ótica, se a configuração está de
pé — e pra traduzir erro da Meta em instrução acionável em português na hora que
algo falha, em vez de mostrar código numérico pra quem não é técnico.

Sem rede: só valida configuração local. O diagnóstico que depende de token vive em
`instagram_oauth.py`, porque precisa falar com a Graph API.
"""

from __future__ import annotations

from urllib.parse import urlparse

from pydantic import BaseModel

_CALLBACK_PATH = "/auth/facebook/callback"


class PreflightCheck(BaseModel):
    key: str
    label: str
    ok: bool
    hint: str = ""


def check_config(
    *,
    app_id: str,
    app_secret: str,
    redirect_uri: str,
    api_base_url: str,
) -> list[PreflightCheck]:
    """Confere o que precisa estar certo antes de alguém clicar em Conectar Instagram."""
    redirect = urlparse(redirect_uri)
    api = urlparse(api_base_url)

    return [
        PreflightCheck(
            key="app_id",
            label="ID do app da Meta configurado",
            ok=bool(app_id),
            hint="Preencha META_APP_ID no .env com o ID do app em developers.facebook.com.",
        ),
        PreflightCheck(
            key="app_secret",
            label="Chave secreta do app configurada",
            ok=bool(app_secret),
            hint="Preencha META_APP_SECRET no .env (App Settings → Basic → App Secret).",
        ),
        PreflightCheck(
            key="redirect_uri_publica",
            label="URL de retorno acessível pela internet",
            ok=_is_public_https(redirect),
            hint=(
                "A Meta redireciona o navegador pra essa URL — localhost só existe na sua "
                "máquina. Suba um túnel (ngrok) ou use o domínio do servidor, e cadastre a "
                "URL em Facebook Login → Settings → Valid OAuth Redirect URIs."
            ),
        ),
        PreflightCheck(
            key="redirect_uri_caminho",
            label=f"URL de retorno aponta pra {_CALLBACK_PATH}",
            ok=redirect.path.rstrip("/") == _CALLBACK_PATH,
            hint=f"META_OAUTH_REDIRECT_URI precisa terminar em {_CALLBACK_PATH}.",
        ),
        PreflightCheck(
            key="api_base_url_publica",
            label="Endereço público da API acessível pela internet",
            ok=_is_public_https(api),
            hint=(
                "Os servidores da Meta baixam a imagem do post desse endereço. Se apontar "
                "pra localhost, a publicação falha mesmo com o login funcionando. "
                "Ajuste API_BASE_URL."
            ),
        ),
        PreflightCheck(
            key="mesmo_host",
            label="URL de retorno e API no mesmo endereço",
            ok=bool(redirect.netloc) and redirect.netloc == api.netloc,
            hint=(
                "Os dois apontam pra hosts diferentes. Ao trocar de túnel, atualize "
                "META_OAUTH_REDIRECT_URI e API_BASE_URL juntos."
            ),
        ),
    ]


def _is_public_https(parsed: object) -> bool:
    """HTTPS obrigatório e host que exista fora da máquina local."""
    scheme = getattr(parsed, "scheme", "")
    hostname = getattr(parsed, "hostname", None) or ""
    if scheme != "https" or not hostname:
        return False
    return hostname not in {"localhost", "127.0.0.1", "0.0.0.0", "::1"}


_ERROR_HINTS: dict[int, str] = {
    3: (
        "O app da Meta não tem a permissão necessária liberada. Confira se os produtos "
        "Facebook Login e Instagram Graph API estão adicionados ao app."
    ),
    9: (
        "O Instagram limitou a publicação nessa conta por política de uso. Aguarde a "
        "restrição cair e não tente publicar de novo enquanto durar."
    ),
    10: (
        "Permissão não concedida no login. Refaça a conexão e aceite TODAS as permissões "
        "na tela do Facebook — recusar uma delas quebra a publicação."
    ),
    200: (
        "Permissão insuficiente. Com o app em modo desenvolvimento, a pessoa precisa estar "
        "cadastrada como desenvolvedor ou testador do app e ter aceitado o convite."
    ),
    190: (
        "O token expirou ou foi revogado. Reconecte o Instagram pelo painel — "
        "nenhuma configuração se perde."
    ),
    368: (
        "A conta está temporariamente bloqueada pela Meta por violação de política. "
        "Não tente publicar de novo: insistir aumenta a punição. Abra recurso em "
        "facebook.com/support e aguarde liberar."
    ),
    4: "Cota de chamadas do app estourada. Aguarde a virada da hora antes de tentar de novo.",
    17: "Cota do usuário estourada. Aguarde a virada da hora antes de tentar de novo.",
    32: "Cota da página estourada. Aguarde a virada da hora antes de tentar de novo.",
    613: "Limite de chamadas atingido. Aguarde alguns minutos antes de tentar de novo.",
    1: "Falha temporária da Meta. Tente de novo em alguns minutos.",
    2: "Serviço da Meta indisponível no momento. Tente de novo em alguns minutos.",
}

_FALLBACK_HINT = (
    "A Meta recusou a operação e não deu um motivo que a gente saiba traduzir. "
    "Anote o código e o fbtrace_id do log antes de tentar de novo."
)


def explain_ig_error(code: int | None) -> str:
    """Traduz código de erro da Graph API em instrução acionável em português."""
    if code is None:
        return _FALLBACK_HINT
    return _ERROR_HINTS.get(code, _FALLBACK_HINT)
