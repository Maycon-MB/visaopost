"""
Servidor local para demo mobile.
Serve approval.html na rede local e imprime QR code no terminal.
"""
import http.server
import os
import socket
import socketserver
import threading
import webbrowser
from pathlib import Path

PORT = 8765
DEMO_DIR = Path(__file__).parent


def get_local_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    finally:
        s.close()


def print_qr(url: str):
    try:
        import qrcode
        qr = qrcode.QRCode(border=1)
        qr.add_data(url)
        qr.make(fit=True)
        qr.print_ascii(invert=True)
    except ImportError:
        print("(instale qrcode para ver o QR: pip install qrcode)")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DEMO_DIR), **kwargs)

    def log_message(self, fmt, *args):
        pass  # silencia logs


if __name__ == "__main__":
    approval_file = DEMO_DIR / "approval.html"
    if not approval_file.exists():
        print("ERRO: approval.html nao encontrado. Execute primeiro: python generate_post.py")
        exit(1)

    ip = get_local_ip()
    url = f"http://{ip}:{PORT}/approval.html"

    print(f"\n{'='*52}")
    print(f"  Demo pronto! Escaneie o QR com o celular:")
    print(f"{'='*52}\n")
    print_qr(url)
    print(f"\n  Link manual: {url}")
    print(f"\n  (PC e celular devem estar na mesma rede Wi-Fi)")
    print(f"  Pressione Ctrl+C para encerrar\n")
    print(f"{'='*52}\n")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
