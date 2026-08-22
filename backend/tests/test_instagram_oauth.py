"""Testa build_authorize_url (pura, sem rede). Exchange/list_pages precisam de
httpx mock que o repo não tem hoje — cobertos por smoke manual, não unit test."""

from __future__ import annotations

from unittest.mock import patch

from app.services.instagram_oauth import OAUTH_SCOPES, build_authorize_url


def test_build_authorize_url_contem_state_e_scopes() -> None:
    with patch("app.services.instagram_oauth.get_settings") as mock_settings:
        mock_settings.return_value.meta_app_id = "123456"
        mock_settings.return_value.meta_oauth_redirect_uri = "http://localhost:8000/auth/facebook/callback"
        url = build_authorize_url("state-abc")

    assert "client_id=123456" in url
    assert "state=state-abc" in url
    assert "redirect_uri=" in url
    for scope in OAUTH_SCOPES:
        assert scope in url
