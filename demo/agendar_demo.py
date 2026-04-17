"""
Aguarda ate o horario agendado e envia o e-mail de aprovacao.
Lock de tela nao afeta a execucao — o processo continua rodando.
"""
import sys
import time
from datetime import datetime, date
from pathlib import Path

SEND_AT = "13:10"  # horario de envio

sys.path.insert(0, str(Path(__file__).parent))
from send_demo import generate, build_email, send, DEST_EMAIL, BRAND

def wait_until(hhmm: str):
    h, m = map(int, hhmm.split(":"))
    target = datetime.now().replace(hour=h, minute=m, second=0, microsecond=0)
    diff = (target - datetime.now()).total_seconds()
    if diff <= 0:
        print(f"[AVISO] {hhmm} ja passou. Enviando imediatamente.")
        return
    print(f"E-mail agendado para {hhmm} de hoje.")
    print(f"Aguardando {int(diff//60)}min {int(diff%60)}s...")
    print(f"(Pode travar a tela — este processo continua rodando)")
    print()

    while True:
        remaining = (target - datetime.now()).total_seconds()
        if remaining <= 0:
            break
        mins = int(remaining // 60)
        secs = int(remaining % 60)
        print(f"\r  [{datetime.now().strftime('%H:%M:%S')}] Faltam {mins:02d}:{secs:02d}  ", end="", flush=True)
        time.sleep(1)

    print(f"\n\n[{datetime.now().strftime('%H:%M:%S')}] Horario atingido! Enviando...")

if __name__ == "__main__":
    wait_until(SEND_AT)

    img_path, _ = generate()
    html = build_email(img_path)
    send(html, img_path)

    print()
    print("=" * 50)
    print(f"  E-mail enviado as {datetime.now().strftime('%H:%M:%S')}!")
    print(f"  Destino: {DEST_EMAIL}")
    print("=" * 50)
