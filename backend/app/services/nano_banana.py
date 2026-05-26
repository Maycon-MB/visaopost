"""Edita foto de produto (óculos do cliente) via Gemini 2.5 Flash Image (Nano Banana).

Mandato CLAUDE.md: NÃO usar IA generativa pura para produto da ótica. Foto real do
cliente é input obrigatório. Modelo apenas refina iluminação/fundo/contexto.
"""

from __future__ import annotations

from pathlib import Path

import google.generativeai as genai
from PIL import Image

from app.config import get_settings
from app.logging import get_logger

logger = get_logger(__name__)

_MODEL_NAME = "gemini-2.5-flash-image"


def edit_product_photo(
    *,
    source_image_path: str | Path,
    edit_prompt: str,
) -> bytes:
    """Aplica edição ao óculos do cliente. Retorna bytes da imagem editada.

    Ex: edit_prompt='Coloque este óculos sobre fundo neutro bege com iluminação
    suave de estúdio, ângulo 3/4, sem alterar o produto.'
    """
    settings = get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY ausente no .env")

    src = Path(source_image_path)
    if not src.exists():
        raise FileNotFoundError(f"Foto produto não encontrada: {src}")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(_MODEL_NAME)

    source = Image.open(src)
    guarded_prompt = (
        f"{edit_prompt}\n\n"
        "INSTRUÇÕES OBRIGATÓRIAS:\n"
        "- Preserve EXATAMENTE o produto (óculos) da foto original.\n"
        "- Não invente armação, lentes, marca, formato. Use só o que está na foto.\n"
        "- Pode mudar fundo, iluminação, ângulo de câmera, contexto.\n"
        "- Resultado: imagem fotográfica realista, sem texto, sem watermark."
    )

    response = model.generate_content([guarded_prompt, source])

    for part in response.candidates[0].content.parts:
        inline = getattr(part, "inline_data", None)
        if inline and inline.data:
            logger.info(
                "nano_banana.image.edited",
                source=str(src),
                bytes=len(inline.data),
                mime=getattr(inline, "mime_type", "unknown"),
            )
            return bytes(inline.data)

    raise RuntimeError("Nano Banana não retornou imagem (apenas texto?)")
